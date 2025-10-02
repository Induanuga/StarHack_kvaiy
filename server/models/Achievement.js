const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "🏆",
  },
  category: {
    type: String,
    enum: ["health", "wealth", "financial", "social", "milestone"],
    required: true,
  },
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common",
  },
  requirement: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    default: 100,
  },
  badge: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Achievement", AchievementSchema);
