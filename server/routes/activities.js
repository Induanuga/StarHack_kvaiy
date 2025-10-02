const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route   GET /api/activities
// @desc    Get activity feed
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get activities from followed users and own activities
    const activities = await Activity.find({
      $or: [
        { user: req.user.id },
        { user: { $in: user.following }, isPublic: true },
      ],
    })
      .populate("user", "username profile.avatar level")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/activities/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const { period = "all", category = "points" } = req.query;

    let dateFilter = {};
    if (period === "daily") {
      dateFilter = {
        lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      };
    } else if (period === "weekly") {
      dateFilter = {
        lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      };
    } else if (period === "monthly") {
      dateFilter = {
        lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      };
    }

    const sortField = category === "xp" ? "xp" : "points";

    const leaderboard = await User.find(dateFilter)
      .select("username profile.avatar level points xp stats")
      .sort({ [sortField]: -1 })
      .limit(100);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/activities/:id/like
// @desc    Like an activity
// @access  Private
router.post("/:id/like", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    // Check if already liked
    const index = activity.likes.indexOf(req.user.id);

    if (index > -1) {
      activity.likes.splice(index, 1);
    } else {
      activity.likes.push(req.user.id);
    }

    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/activities/:id/comment
// @desc    Comment on an activity
// @access  Private
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    activity.comments.push({
      user: req.user.id,
      text,
    });

    await activity.save();

    const populated = await activity.populate(
      "comments.user",
      "username profile.avatar"
    );
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
