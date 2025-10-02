const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        name: String,
        avatar: String,
        healthScore: { type: Number, default: 0 },
        wealthScore: { type: Number, default: 0 },
        level: { type: Number, default: 1 }
    },
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }],
    rewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }],
    dailyActivities: [{
        date: Date,
        activities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);