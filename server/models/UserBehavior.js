const mongoose = require("mongoose");

const UserBehaviorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityPattern: {
    mostActiveTime: String, // morning, afternoon, evening, night
    mostActiveDay: String, // monday, tuesday, etc
    averageSessionDuration: Number, // minutes
    preferredCategories: [String], // health, wealth, financial
    completionRate: Number, // percentage
    averageTimeToComplete: Number, // days
  },
  challengeHistory: [
    {
      category: String,
      difficulty: String,
      completed: Boolean,
      timeToComplete: Number,
      timestamp: Date,
    },
  ],
  predictedChallenges: [
    {
      challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
      },
      confidence: Number, // 0-100
      reason: String,
      suggestedAt: Date,
    },
  ],
  lastAnalyzed: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserBehavior", UserBehaviorSchema);
