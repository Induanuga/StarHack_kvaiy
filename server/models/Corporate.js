const mongoose = require("mongoose");

const CorporateSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  industry: String,
  size: {
    type: String,
    enum: ["small", "medium", "large", "enterprise"],
    default: "medium",
  },
  subscription: {
    plan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    price: Number,
  },
  employees: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      department: String,
      role: String,
      joinedAt: Date,
    },
  ],
  competitions: [
    {
      name: String,
      description: String,
      startDate: Date,
      endDate: Date,
      prize: String,
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      status: {
        type: String,
        enum: ["upcoming", "active", "completed"],
        default: "upcoming",
      },
    },
  ],
  analytics: {
    totalEmployees: Number,
    activeUsers: Number,
    avgEngagementScore: Number,
    totalChallengesCompleted: Number,
    healthScoreImprovement: Number,
  },
  settings: {
    allowExternalChallenges: {
      type: Boolean,
      default: true,
    },
    pointsMultiplier: {
      type: Number,
      default: 1,
    },
    customRewards: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Corporate", CorporateSchema);
