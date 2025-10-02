const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  metrics: {
    dau: Number, // Daily Active Users
    mau: Number, // Monthly Active Users
    newUsers: Number,
    returningUsers: Number,
    churnRate: Number,
    avgSessionDuration: Number,
    challengesStarted: Number,
    challengesCompleted: Number,
    completionRate: Number,
    pointsAwarded: Number,
    rewardsRedeemed: Number,
    revenueGenerated: Number,
  },
  engagement: {
    totalSessions: Number,
    avgChallengesPerUser: Number,
    avgPointsPerUser: Number,
    socialInteractions: Number,
    contentShares: Number,
  },
  retention: {
    day1: Number,
    day7: Number,
    day30: Number,
  },
  categoryBreakdown: {
    health: Number,
    wealth: Number,
    financial: Number,
    insurance: Number,
    aktivo: Number,
    social: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AnalyticsSchema.index({ date: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Analytics", AnalyticsSchema);
