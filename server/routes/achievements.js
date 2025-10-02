const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const Activity = require("../models/Activity");

const auth = require("../middleware/auth");

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      rarity: 1,
      points: 1,
    });

    const userAchievements = await UserAchievement.find({
      user: req.user.id,
    });

    const achievementsWithProgress = achievements.map((achievement) => {
      const userProgress = userAchievements.find(
        (ua) => ua.achievement.toString() === achievement._id.toString()
      );

      return {
        ...achievement.toObject(),
        unlocked: !!userProgress,
        unlockedAt: userProgress?.unlockedAt,
        progress: userProgress?.progress || 0,
      };
    });

    res.json(achievementsWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
