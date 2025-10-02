const express = require("express");
const router = express.Router();
const User = require("../models/User");
const FamilyGroup = require("../models/FamilyGroup");
const UserProgress = require("../models/UserProgress");
const auth = require("../middleware/auth");

// @route   GET /api/leaderboard/overall
// @desc    Get overall leaderboard - ALL USERS without limit
// @access  Private
router.get("/overall", auth, async (req, res) => {
  try {
    const { period = "all" } = req.query;

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

    // Get ALL users sorted by points - NO LIMIT
    const users = await User.find(dateFilter)
      .select("username profile.avatar level points xp stats streak createdAt")
      .sort({ points: -1, xp: -1 });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.profile?.avatar,
      level: user.level,
      points: user.points,
      xp: user.xp,
      challengesCompleted: user.stats?.challengesCompleted || 0,
      streak: user.streak?.current || 0,
      memberSince: user.createdAt,
      isCurrentUser: user._id.toString() === req.user.id,
    }));

    // Find current user's rank
    const currentUserIndex = leaderboard.findIndex((u) => u.isCurrentUser);
    const currentUserRank = currentUserIndex + 1;
    const currentUser = leaderboard[currentUserIndex];

    const totalUsers = leaderboard.length;

    res.json({
      leaderboard, // ALL users
      currentUserRank,
      totalUsers,
      currentUser: currentUser
        ? {
            username: currentUser.username,
            points: currentUser.points,
            level: currentUser.level,
            rank: currentUserRank,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/leaderboard/health
// @desc    Get health category leaderboard - ALL users
// @access  Private
router.get("/health", auth, async (req, res) => {
  try {
    // Get ALL users with their health challenge completion count
    const healthProgress = await UserProgress.aggregate([
      {
        $lookup: {
          from: "challenges",
          localField: "challenge",
          foreignField: "_id",
          as: "challengeInfo",
        },
      },
      { $unwind: "$challengeInfo" },
      {
        $match: {
          "challengeInfo.category": "health",
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$user",
          healthChallenges: { $sum: 1 },
          totalPoints: { $sum: "$challengeInfo.points" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $sort: { healthChallenges: -1, totalPoints: -1 },
      },
      // NO LIMIT - show ALL users
    ]);

    const leaderboard = healthProgress.map((item, index) => ({
      rank: index + 1,
      userId: item._id,
      username: item.userInfo.username,
      avatar: item.userInfo.profile?.avatar,
      level: item.userInfo.level,
      healthChallenges: item.healthChallenges,
      totalPoints: item.totalPoints,
      isCurrentUser: item._id.toString() === req.user.id,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/leaderboard/wealth
// @desc    Get wealth category leaderboard - ALL users
// @access  Private
router.get("/wealth", auth, async (req, res) => {
  try {
    const wealthProgress = await UserProgress.aggregate([
      {
        $lookup: {
          from: "challenges",
          localField: "challenge",
          foreignField: "_id",
          as: "challengeInfo",
        },
      },
      { $unwind: "$challengeInfo" },
      {
        $match: {
          "challengeInfo.category": { $in: ["wealth", "financial"] },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$user",
          wealthChallenges: { $sum: 1 },
          totalPoints: { $sum: "$challengeInfo.points" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $sort: { wealthChallenges: -1, totalPoints: -1 },
      },
      // NO LIMIT - show ALL users
    ]);

    const leaderboard = wealthProgress.map((item, index) => ({
      rank: index + 1,
      userId: item._id,
      username: item.userInfo.username,
      avatar: item.userInfo.profile?.avatar,
      level: item.userInfo.level,
      wealthChallenges: item.wealthChallenges,
      totalPoints: item.totalPoints,
      isCurrentUser: item._id.toString() === req.user.id,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/leaderboard/family
// @desc    Get family groups leaderboard
// @access  Private
router.get("/family", auth, async (req, res) => {
  try {
    const groups = await FamilyGroup.find({ isActive: true })
      .populate("members.user", "username profile.avatar points level")
      .sort({ groupPoints: -1 })
      .limit(50);

    const leaderboard = groups.map((group, index) => ({
      rank: index + 1,
      groupId: group._id,
      name: group.name,
      groupPoints: group.groupPoints,
      groupLevel: group.groupLevel,
      memberCount: group.members.length,
      topMembers: group.members
        .sort((a, b) => (b.user?.points || 0) - (a.user?.points || 0))
        .slice(0, 3)
        .map((m) => ({
          username: m.user?.username,
          avatar: m.user?.profile?.avatar,
          points: m.user?.points,
        })),
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/leaderboard/top-performers
// @desc    Get top 10 performers of all time
// @access  Private
router.get("/top-performers", auth, async (req, res) => {
  try {
    const topUsers = await User.find()
      .select("username profile.avatar level points xp stats streak")
      .sort({ points: -1, xp: -1 })
      .limit(10);

    const performers = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.profile?.avatar,
      level: user.level,
      points: user.points,
      xp: user.xp,
      challengesCompleted: user.stats?.challengesCompleted || 0,
      streak: user.streak?.current || 0,
    }));

    res.json(performers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
