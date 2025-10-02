const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        enum: ['Health', 'Wealth', 'Financial', 'Social'],
        required: true
    },
    type: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Special'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    requirements: [{
        type: String
    }],
    rewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }],
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Failed'],
            default: 'Active'
        },
        progress: {
            type: Number,
            default: 0
        }
    }],
    startDate: Date,
    endDate: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);