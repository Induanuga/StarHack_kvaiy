const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/activities
// @desc    Get user activities
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.dailyActivities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/activities
// @desc    Log a new activity
router.post('/', auth, async (req, res) => {
    try {
        const { activityType, duration, details } = req.body;
        const user = await User.findById(req.user.id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dailyActivity = user.dailyActivities.find(
            activity => new Date(activity.date).getTime() === today.getTime()
        );

        if (!dailyActivity) {
            dailyActivity = {
                date: today,
                activities: []
            };
            user.dailyActivities.push(dailyActivity);
        }

        dailyActivity.activities.push({
            activityType,
            duration,
            details,
            completedAt: new Date()
        });

        await user.save();
        res.json(user.dailyActivities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;