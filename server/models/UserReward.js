const mongoose = require("mongoose");

const UserRewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    required: true,
  },
  redeemedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "used", "expired"],
    default: "active",
  },
  code: {
    type: String,
    unique: true,
  },
  usedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("UserReward", UserRewardSchema);
