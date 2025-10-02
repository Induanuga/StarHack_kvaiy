const express = require("express");
const router = express.Router();
const MLService = require("../services/mlService");
const UserBehavior = require("../models/UserBehavior");
const Challenge = require("../models/Challenge");
const auth = require("../middleware/auth");

// @route   GET /api/ml/recommendations
// @desc    Get AI-powered challenge recommendations
// @access  Private
router.get("/recommendations", auth, async (req, res) => {
  try {
    // Analyze user behavior first
    await MLService.analyzeUserBehavior(req.user.id);

    // Get predictions
    const predictions = await MLService.predictChallenges(req.user.id);

    // Populate challenge details
    const recommendations = await Promise.all(
      predictions.map(async (pred) => {
        const challenge = await Challenge.findById(pred.challenge);
        return {
          ...challenge.toObject(),
          confidence: pred.confidence,
          reason: pred.reason,
        };
      })
    );

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/ml/behavior-insights
// @desc    Get user behavior insights
// @access  Private
router.get("/behavior-insights", auth, async (req, res) => {
  try {
    const behavior = await UserBehavior.findOne({ user: req.user.id });

    if (!behavior) {
      return res.json({
        message: "Complete more challenges to get insights",
        hasData: false,
      });
    }

    res.json({
      hasData: true,
      patterns: behavior.activityPattern,
      insights: {
        totalChallenges: behavior.challengeHistory.length,
        completionRate: behavior.activityPattern.completionRate,
        preferredCategories: behavior.activityPattern.preferredCategories,
        avgTimeToComplete: behavior.activityPattern.averageTimeToComplete,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
