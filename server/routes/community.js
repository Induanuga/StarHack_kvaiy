const express = require("express");
const router = express.Router();
const CommunityChallenge = require("../models/CommunityChallenge");
const User = require("../models/User");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");

// @route   GET /api/community/challenges
// @desc    Get all active community challenges
// @access  Private
router.get("/challenges", auth, async (req, res) => {
  try {
    const challenges = await CommunityChallenge.find({
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("participants.user", "username profile.avatar level");

    const challengesWithUserData = challenges.map((challenge) => {
      const userParticipation = challenge.participants.find(
        (p) => p.user._id.toString() === req.user.id
      );

      return {
        ...challenge.toObject(),
        isParticipating: !!userParticipation,
        userContribution: userParticipation?.contribution || 0,
        progressPercentage: Math.round(
          (challenge.currentProgress / challenge.goal) * 100
        ),
        participantCount: challenge.participants.length,
      };
    });

    res.json(challengesWithUserData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/community/challenges/:id/join
// @desc    Join a community challenge
// @access  Private
router.post("/challenges/:id/join", auth, async (req, res) => {
  try {
    const challenge = await CommunityChallenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    // Check if already participating
    const existing = challenge.participants.find(
      (p) => p.user.toString() === req.user.id
    );

    if (existing) {
      return res.status(400).json({ msg: "Already participating" });
    }

    challenge.participants.push({
      user: req.user.id,
      contribution: 0,
      joinedAt: Date.now(),
    });

    await challenge.save();

    await Activity.create({
      user: req.user.id,
      type: "social",
      title: `Joined Community Challenge: ${challenge.title}`,
      description: `Join ${challenge.participants.length} others in achieving this goal!`,
      icon: challenge.icon,
      points: 0,
    });

    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/community/challenges/:id/contribute
// @desc    Contribute to a community challenge
// @access  Private
router.put("/challenges/:id/contribute", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const challenge = await CommunityChallenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    const participant = challenge.participants.find(
      (p) => p.user.toString() === req.user.id
    );

    if (!participant) {
      return res
        .status(400)
        .json({ msg: "Not participating in this challenge" });
    }

    // Update contribution
    participant.contribution += amount;
    challenge.currentProgress += amount;

    // Check milestones
    challenge.milestones.forEach((milestone) => {
      if (
        !milestone.reached &&
        challenge.currentProgress >= milestone.threshold
      ) {
        milestone.reached = true;
        milestone.reachedAt = Date.now();
      }
    });

    // Check if completed
    if (
      challenge.currentProgress >= challenge.goal &&
      challenge.status === "active"
    ) {
      challenge.status = "completed";

      // Award rewards to all participants
      for (const p of challenge.participants) {
        const user = await User.findById(p.user);
        user.points += challenge.rewards.points;
        await user.save();

        await Activity.create({
          user: p.user,
          type: "challenge_completed",
          title: `Community Challenge Completed!`,
          description: `${challenge.title} - You contributed ${p.contribution} ${challenge.unit}`,
          icon: "🎉",
          points: challenge.rewards.points,
        });
      }
    }

    await challenge.save();

    res.json({
      challenge,
      message:
        challenge.status === "completed"
          ? "Community challenge completed!"
          : "Contribution recorded",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/community/challenges
// @desc    Create a community challenge
// @access  Private
router.post("/challenges", auth, async (req, res) => {
  try {
    const challenge = new CommunityChallenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
