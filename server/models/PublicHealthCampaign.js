const mongoose = require("mongoose");

const PublicHealthCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sponsor: {
    name: String,
    type: {
      type: String,
      enum: ["government", "ngo", "healthcare", "corporate"],
      default: "government",
    },
    logo: String,
  },
  category: {
    type: String,
    enum: [
      "vaccination",
      "disease_prevention",
      "mental_health",
      "fitness",
      "nutrition",
      "smoking_cessation",
    ],
    required: true,
  },
  goals: [
    {
      metric: String,
      target: Number,
      current: Number,
      unit: String,
    },
  ],
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      contribution: Number,
      joinedAt: Date,
      region: String,
    },
  ],
  rewards: {
    individual: {
      points: Number,
      badge: String,
      certificate: Boolean,
    },
    community: {
      description: String,
      unlockThreshold: Number,
    },
  },
  regions: [
    {
      name: String,
      participants: Number,
      progress: Number,
    },
  ],
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
    enum: ["upcoming", "active", "completed"],
    default: "upcoming",
  },
  impact: {
    peopleReached: Number,
    healthOutcomes: String,
    costSavings: Number,
  },
  educationalContent: [
    {
      title: String,
      content: String,
      mediaUrl: String,
      type: {
        type: String,
        enum: ["article", "video", "infographic"],
      },
    },
  ],
  icon: String,
  color: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "PublicHealthCampaign",
  PublicHealthCampaignSchema
);
