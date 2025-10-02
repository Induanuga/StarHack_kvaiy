const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Reward = require('../models/Reward');

// @route   GET api/rewards
// @desc    Get user rewards
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('rewards');
        res.json(user.rewards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/rewards/claim
// @desc    Claim a reward
router.post('/claim/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const reward = await Reward.findById(req.params.id);

        if (!reward) {
            return res.status(404).json({ msg: 'Reward not found' });
        }

        user.rewards.push(reward._id);
        await user.save();

        res.json(user.rewards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;