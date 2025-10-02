const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Challenge = require('../models/Challenge');

// @route   GET api/challenges
// @desc    Get all active challenges
router.get('/', auth, async (req, res) => {
    try {
        const challenges = await Challenge.find({ isActive: true })
            .populate('rewards')
            .sort({ createdAt: -1 });
        res.json(challenges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/challenges/join/:id
// @desc    Join a challenge
router.post('/join/:id', auth, async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        // Check if user already joined
        const alreadyJoined = challenge.participants.find(
            participant => participant.user.toString() === req.user.id
        );

        if (alreadyJoined) {
            return res.status(400).json({ msg: 'Already joined this challenge' });
        }

        challenge.participants.push({
            user: req.user.id,
            status: 'Active',
            progress: 0
        });

        await challenge.save();
        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/challenges/progress/:id
// @desc    Update challenge progress
router.put('/progress/:id', auth, async (req, res) => {
    try {
        const { progress } = req.body;
        const challenge = await Challenge.findById(req.params.id);

        const participantIndex = challenge.participants.findIndex(
            p => p.user.toString() === req.user.id
        );

        if (participantIndex === -1) {
            return res.status(400).json({ msg: 'Not participating in this challenge' });
        }

        challenge.participants[participantIndex].progress = progress;
        if (progress >= 100) {
            challenge.participants[participantIndex].status = 'Completed';
        }

        await challenge.save();
        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;