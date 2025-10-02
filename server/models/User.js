const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    dateOfBirth: Date,
    gender: String,
    phone: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  streak: {
    current: {
      type: Number,
      default: 0,
    },
    longest: {
      type: Number,
      default: 0,
    },
    lastActivityDate: Date,
  },
  badges: [
    {
      type: String,
    },
  ],
  stats: {
    challengesCompleted: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    achievementsUnlocked: {
      type: Number,
      default: 0,
    },
    rewardsRedeemed: {
      type: Number,
      default: 0,
    },
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    publicProfile: {
      type: Boolean,
      default: true,
    },
    shareProgress: {
      type: Boolean,
      default: true,
    },
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
