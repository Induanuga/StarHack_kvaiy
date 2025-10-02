const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["health", "wealth", "financial", "insurance", "aktivo", "social"],
    required: true,
  },
  type: {
    type: String,
    enum: ["daily", "weekly", "monthly", "milestone", "community"],
    default: "daily",
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard", "expert"],
    default: "medium",
  },
  points: {
    type: Number,
    required: true,
    default: 10,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  target: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    default: "count",
  },
  icon: {
    type: String,
    default: "🎯",
  },
  color: {
    type: String,
    default: "#4CAF50",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Challenge", challengeSchema);
