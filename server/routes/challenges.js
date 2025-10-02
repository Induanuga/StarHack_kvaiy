const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");
const Activity = require("../models/Activity");

// Auth middleware
const auth = require("../middleware/auth");

// @route   GET /api/challenges
// @desc    Get all active challenges
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
        };
      })
    );

    res.json(challengesWithProgress);
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

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/challenges/:id/progress
// @desc    Update challenge progress
// @access  Private
router.put("/:id/progress", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const progress = await UserProgress.findOne({
      user: req.user.id,
      challenge: req.params.id,
    });

    if (!progress) {
      return res.status(404).json({ msg: "Progress not found" });
    }

    progress.progress += amount;
    progress.lastUpdated = Date.now();

    // Check if challenge is completed
    if (progress.progress >= progress.target) {
      progress.status = "completed";
      progress.completedAt = Date.now();

      // Award points and XP
      const challenge = await Challenge.findById(req.params.id);
      const user = await User.findById(req.user.id);

      user.points += challenge.points;
      user.xp += challenge.xpReward;
      user.stats.challengesCompleted += 1;

      // Check for level up
      const newLevel = Math.floor(user.xp / 1000) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;

        // Create level up activity
        await Activity.create({
          user: user._id,
          type: "level_up",
          title: `Leveled up to ${newLevel}!`,
          description: `Congratulations! You've reached level ${newLevel}`,
          icon: "⬆️",
          points: 0,
        });
      }

      await user.save();

      // Create activity
      await Activity.create({
        user: user._id,
        type: "challenge_completed",
        title: `Completed: ${challenge.title}`,
        description: challenge.description,
        icon: challenge.icon,
        points: challenge.points,
      });
    }

    await progress.save();
    res.json(progress);
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
    const progresses = await UserProgress.find({
      user: req.user.id,
      status: "active",
    }).populate("challenge");

    res.json(progresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/challenges
// @desc    Create a new challenge (admin)
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
