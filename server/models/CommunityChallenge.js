const mongoose = require("mongoose");

const CommunityChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["health", "wealth", "financial", "social"],
    required: true,
  },
  type: {
    type: String,
    enum: ["community", "global", "regional"],
    default: "community",
  },
  goal: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  currentProgress: {
    type: Number,
    default: 0,
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      contribution: {
        type: Number,
        default: 0,
      },
      joinedAt: Date,
    },
  ],
  rewards: {
    points: Number,
    badge: String,
    specialReward: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "failed"],
    default: "active",
  },
  icon: String,
  color: String,
  milestones: [
    {
      threshold: Number,
      reached: Boolean,
      reachedAt: Date,
      bonus: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CommunityChallenge", CommunityChallengeSchema);
