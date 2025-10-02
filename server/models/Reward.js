const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "discount",
      "voucher",
      "badge",
      "premium",
      "cashback",
      "merchandise",
    ],
    required: true,
  },
  category: {
    type: String,
    enum: ["health", "wealth", "insurance", "lifestyle", "premium"],
    required: true,
  },
  pointsCost: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
  },
  icon: {
    type: String,
    default: "🎁",
  },
  image: {
    type: String,
  },
  stockAvailable: {
    type: Number,
    default: -1,
  },
  expiryDays: {
    type: Number,
    default: 30,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  partnerName: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reward", RewardSchema);
