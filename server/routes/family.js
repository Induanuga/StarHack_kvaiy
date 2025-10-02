const express = require('express');
const router = express.Router();
const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// @route   POST /api/family/create
// @desc    Create a family group
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Generate unique invite code
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const familyGroup = new FamilyGroup({
      name,
      description,
      createdBy: req.user.id,
      inviteCode,
      members: [{
        user: req.user.id,
        role: 'admin'
      }]
    });

    await familyGroup.save();

    res.status(201).json(familyGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/family/join/:inviteCode
// @desc    Join a family group
// @access  Private
router.post('/join/:inviteCode', auth, async (req, res) => {
  try {
    const familyGroup = await FamilyGroup.findOne({ inviteCode: req.params.inviteCode });

    if (!familyGroup) {
      return res.status(404).json({ msg: 'Family group not found' });
    }

    // Check if already a member
    const isMember = familyGroup.members.some(m => m.user.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ msg: 'Already a member of this group' });
    }

    familyGroup.members.push({
      user: req.user.id,
      role: 'member'
    });

    await familyGroup.save();

    res.json(familyGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/family/my-groups
// @desc    Get user's family groups
// @access  Private
router.get('/my-groups', auth, async (req, res) => {
  try {
    const groups = await FamilyGroup.find({
      'members.user': req.user.id,
      isActive: true
    }).populate('members.user', 'username profile.avatar level points');

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/family/:id
// @desc    Get family group details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await FamilyGroup.findById(req.params.id)
      .populate('members.user', 'username profile.avatar level points stats');

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
