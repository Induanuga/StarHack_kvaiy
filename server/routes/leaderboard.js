const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FamilyGroup = require('../models/FamilyGroup');
const auth = require('../middleware/auth');

// @route   GET /api/leaderboard/overall
// @desc    Get overall leaderboard
// @access  Private
router.get('/overall', auth, async (req, res) => {
  try {
    const { period = 'all', limit = 50 } = req.query;
    
    let dateFilter = {};
    if (period === 'daily') {
      dateFilter = { lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    } else if (period === 'weekly') {
      dateFilter = { lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'monthly') {
      dateFilter = { lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const users = await User.find(dateFilter)
      .select('username profile.avatar level points xp stats streak')
      .sort({ points: -1, xp: -1 })
      .limit(parseInt(limit));

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
      isCurrentUser: user._id.toString() === req.user.id
    }));

    // Find current user's rank if not in top
    const currentUser = await User.findById(req.user.id);
    let currentUserRank = leaderboard.findIndex(u => u.isCurrentUser) + 1;
    
    if (currentUserRank === 0) {
      const usersAbove = await User.countDocuments({
        ...dateFilter,
        $or: [
          { points: { $gt: currentUser.points } },
          { points: currentUser.points, xp: { $gt: currentUser.xp } }
        ]
      });
      currentUserRank = usersAbove + 1;
    }

    res.json({
      leaderboard,
      currentUserRank,
      totalUsers: await User.countDocuments(dateFilter)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/leaderboard/health
// @desc    Get health category leaderboard
// @access  Private
router.get('/health', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username profile.avatar level stats')
      .sort({ 'stats.challengesCompleted': -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.profile?.avatar,
      level: user.level,
      healthChallenges: user.stats?.challengesCompleted || 0,
      isCurrentUser: user._id.toString() === req.user.id
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/leaderboard/family
// @desc    Get family groups leaderboard
// @access  Private
router.get('/family', auth, async (req, res) => {
  try {
    const groups = await FamilyGroup.find({ isActive: true })
      .populate('members.user', 'username profile.avatar')
      .sort({ groupPoints: -1 })
      .limit(50);

    const leaderboard = groups.map((group, index) => ({
      rank: index + 1,
      groupId: group._id,
      name: group.name,
      groupPoints: group.groupPoints,
      groupLevel: group.groupLevel,
      memberCount: group.members.length,
      topMembers: group.members.slice(0, 3).map(m => ({
        username: m.user.username,
        avatar: m.user.profile?.avatar
      }))
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
