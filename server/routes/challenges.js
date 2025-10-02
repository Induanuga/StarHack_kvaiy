const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const MLService = require("../services/mlService");

// Auth middleware
const auth = require("../middleware/auth");

// Helper function to check and unlock achievements
async function checkAchievements(userId) {
  try {
    const user = await User.findById(userId);
    const achievements = await Achievement.find();

    for (const achievement of achievements) {
      const hasAchievement = await UserAchievement.findOne({
        user: userId,
        achievement: achievement._id,
      });

      if (!hasAchievement) {
        let unlocked = false;

        switch (achievement.requirement) {
          case "challenges_completed":
            unlocked = user.stats.challengesCompleted >= achievement.threshold;
            break;
          case "level":
            unlocked = user.level >= achievement.threshold;
            break;
          case "total_points":
            unlocked = user.stats.totalPoints >= achievement.threshold;
            break;
        }

        if (unlocked) {
          await UserAchievement.create({
            user: userId,
            achievement: achievement._id,
            progress: achievement.threshold,
          });

          user.points += achievement.points;
          user.stats.achievementsUnlocked += 1;
          await user.save();

          await Activity.create({
            user: userId,
            type: "achievement_unlocked",
            title: `Achievement Unlocked: ${achievement.title}`,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error checking achievements:", err);
  }
}

// @route   GET /api/challenges
// @desc    Get all active challenges (AI-powered sorting)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { category, type, difficulty } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter).sort({ createdAt: -1 });

    // Get user's progress for each challenge
    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const progress = await UserProgress.findOne({
          user: req.user.id,
          challenge: challenge._id,
        });

        return {
          ...challenge.toObject(),
          userProgress: progress || null,
          isJoined: !!progress,
          progressPercentage: progress
            ? Math.round((progress.progress / progress.target) * 100)
            : 0,
        };
      })
    );

    // 🤖 ML USAGE HERE: AI-powered sorting of challenges
    try {
      // Step 1: Analyze user's past behavior
      await MLService.analyzeUserBehavior(req.user.id);

      // Step 2: Get ML predictions for which challenges user will complete
      const predictions = await MLService.predictChallenges(req.user.id);

      // predictions = [
      //   { challenge: "id1", confidence: 85, reason: "Matches your interest in health" },
      //   { challenge: "id2", confidence: 72, reason: "Based on your success rate" }
      // ]

      // Step 3: Create confidence score map
      const confidenceMap = new Map(
        predictions.map((pred) => [pred.challenge.toString(), pred.confidence])
      );

      // Step 4: Sort challenges - highest ML confidence first
      challengesWithProgress.sort((a, b) => {
        const aConfidence = confidenceMap.get(a._id.toString()) || 0;
        const bConfidence = confidenceMap.get(b._id.toString()) || 0;
        return bConfidence - aConfidence; // Higher confidence = shown first
      });
    } catch (mlError) {
      console.error("ML sorting error:", mlError);
      // If ML fails, continue with default sorting
    }

    res.json(challengesWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/challenges/stats
// @desc    Get challenge statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const totalChallenges = await Challenge.countDocuments({ isActive: true });
    const joinedChallenges = await UserProgress.countDocuments({
      user: req.user.id,
    });
    const completedChallenges = await UserProgress.countDocuments({
      user: req.user.id,
      status: "completed",
    });
    const activeChallenges = await UserProgress.countDocuments({
      user: req.user.id,
      status: "active",
    });

    res.json({
      totalChallenges,
      joinedChallenges,
      completedChallenges,
      activeChallenges,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/challenges/:id/join
// @desc    Join a challenge
// @access  Private
router.post("/:id/join", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    // Check if already joined
    const existing = await UserProgress.findOne({
      user: req.user.id,
      challenge: challenge._id,
    });

    if (existing) {
      return res.status(400).json({ msg: "Already joined this challenge" });
    }

    // Create progress entry
    const progress = new UserProgress({
      user: req.user.id,
      challenge: challenge._id,
      target: challenge.target,
      status: "active",
    });

    await progress.save();

    // Add user to participants
    challenge.participants.push(req.user.id);
    await challenge.save();

    // Create activity
    await Activity.create({
      user: req.user.id,
      type: "challenge_completed",
      title: `Joined: ${challenge.title}`,
      description: `Started working on "${challenge.description}"`,
      icon: challenge.icon,
      points: 0,
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/challenges/:id/progress
// @desc    Update challenge progress (SECURE - no direct point manipulation)
// @access  Private
router.put("/:id/progress", auth, async (req, res) => {
  try {
    const { amount, action = "increment", activityType, metadata } = req.body;

    // USER CANNOT SEND POINTS - ONLY ACTIVITY DATA
    // Points are calculated SERVER-SIDE only

    const progress = await UserProgress.findOne({
      user: req.user.id,
      challenge: req.params.id,
    });

    if (!progress) {
      return res
        .status(404)
        .json({ msg: "Progress not found. Please join the challenge first." });
    }

    if (progress.status === "completed") {
      return res.status(400).json({ msg: "Challenge already completed" });
    }

    const challenge = await Challenge.findById(req.params.id);

    // STEP 1: VALIDATE ACTIVITY TYPE
    const validActivityTypes = {
      health: ["steps", "workout", "water", "sleep", "meditation"],
      wealth: ["savings", "investment", "budget_log"],
      financial: ["expense_log", "budget_review", "debt_payment"],
      insurance: ["policy_review", "document_upload", "claim_filed"],
      aktivo: ["health_score", "activity_completed"],
      social: ["share", "family_activity", "group_challenge"],
    };

    if (!validActivityTypes[challenge.category]?.includes(activityType)) {
      return res.status(400).json({
        msg: "Invalid activity type for this challenge category",
        validTypes: validActivityTypes[challenge.category],
      });
    }

    // STEP 2: VALIDATE AMOUNT (ANTI-CHEAT)
    const maxAllowedPerUpdate = {
      steps: 20000, // Max 20k steps per update
      workout: 3, // Max 3 workouts per update
      water: 5, // Max 5 glasses per update
      savings: 1000, // Max $1000 per update
      expense_log: 1, // Only 1 expense entry
      policy_review: 1, // Only 1 review
      default: 100,
    };

    const maxAllowed =
      maxAllowedPerUpdate[activityType] || maxAllowedPerUpdate.default;

    if (amount > maxAllowed) {
      return res.status(400).json({
        msg: `Amount too large. Maximum allowed per update: ${maxAllowed} ${challenge.unit}`,
      });
    }

    // STEP 3: UPDATE PROGRESS (NOT POINTS!)
    if (action === "set") {
      progress.progress = Math.min(amount, progress.target);
    } else if (action === "increment") {
      progress.progress = Math.min(progress.progress + amount, progress.target);
    }

    // Update streak
    const now = new Date();
    const lastUpdate = new Date(progress.lastUpdated);
    const daysDiff = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      progress.streak += 1;
    } else if (daysDiff > 1) {
      progress.streak = 1;
    }

    progress.lastUpdated = Date.now();

    // STEP 4: CHECK IF CHALLENGE IS COMPLETED
    // POINTS ARE ONLY AWARDED HERE - NOWHERE ELSE!
    if (progress.progress >= progress.target) {
      progress.status = "completed";
      progress.completedAt = Date.now();

      const user = await User.findById(req.user.id);

      // 🎯 AWARD POINTS (SERVER-SIDE ONLY)
      user.points += challenge.points;
      user.xp += challenge.xpReward;
      user.stats.challengesCompleted += 1;
      user.stats.totalPoints += challenge.points;

      // Update user streak
      const today = new Date().toDateString();
      const lastActivityDate = user.streak.lastActivityDate
        ? new Date(user.streak.lastActivityDate).toDateString()
        : null;

      if (lastActivityDate !== today) {
        const yesterday = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toDateString();

        if (lastActivityDate === yesterday) {
          user.streak.current += 1;
        } else {
          user.streak.current = 1;
        }

        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }

        user.streak.lastActivityDate = Date.now();
      }

      // STEP 5: CHECK FOR LEVEL UP (BONUS POINTS)
      const newLevel = Math.floor(user.xp / 1000) + 1;
      if (newLevel > user.level) {
        const oldLevel = user.level;
        user.level = newLevel;

        // 🎁 BONUS POINTS FOR LEVEL UP
        const levelUpBonus = newLevel * 50;
        user.points += levelUpBonus;

        await Activity.create({
          user: user._id,
          type: "level_up",
          title: `Level Up! 🎉`,
          description: `Congratulations! You've reached level ${newLevel}. Bonus: ${levelUpBonus} points!`,
          icon: "⬆️",
          points: levelUpBonus,
          metadata: { oldLevel, newLevel, bonus: levelUpBonus },
        });
      }

      await user.save();

      // STEP 6: LOG ACTIVITY FOR AUDIT TRAIL
      await Activity.create({
        user: user._id,
        type: "challenge_completed",
        title: `Completed: ${challenge.title}`,
        description: challenge.description,
        icon: challenge.icon,
        points: challenge.points,
        metadata: {
          category: challenge.category,
          difficulty: challenge.difficulty,
          streak: progress.streak,
          activityType,
          amount,
          timestamp: Date.now(),
        },
      });

      // STEP 7: CHECK FOR ACHIEVEMENTS (MORE BONUS POINTS)
      await checkAchievements(req.user.id);
    }

    await progress.save();
    await progress.populate("challenge");

    res.json({
      progress,
      message:
        progress.status === "completed"
          ? "Challenge completed! 🎉"
          : "Progress updated",
      pointsEarned: progress.status === "completed" ? challenge.points : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/challenges/my-challenges
// @desc    Get user's active challenges
// @access  Private
router.get("/my-challenges", auth, async (req, res) => {
  try {
    const { status = "active" } = req.query;

    const filter = { user: req.user.id };
    if (status !== "all") {
      filter.status = status;
    }

    const progresses = await UserProgress.find(filter)
      .populate("challenge")
      .sort({ lastUpdated: -1 });

    res.json(progresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE /api/challenges/:id/leave
// @desc    Leave a challenge
// @access  Private
router.delete("/:id/leave", auth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      user: req.user.id,
      challenge: req.params.id,
    });

    if (!progress) {
      return res.status(404).json({ msg: "Progress not found" });
    }

    if (progress.status === "completed") {
      return res
        .status(400)
        .json({ msg: "Cannot leave a completed challenge" });
    }

    progress.status = "abandoned";
    await progress.save();

    const challenge = await Challenge.findById(req.params.id);
    challenge.participants = challenge.participants.filter(
      (p) => p.toString() !== req.user.id
    );
    await challenge.save();

    res.json({ msg: "Challenge left successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
