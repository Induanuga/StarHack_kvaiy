const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Badge', 'Achievement', 'Milestone'],
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);