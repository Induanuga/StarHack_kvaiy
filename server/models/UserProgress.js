const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  target: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "failed", "abandoned"],
    default: "active",
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

UserProgressSchema.index({ user: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model("UserProgress", UserProgressSchema);
