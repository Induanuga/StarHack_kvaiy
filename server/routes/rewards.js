const express = require("express");
const router = express.Router();
const Reward = require("../models/Reward");
const UserReward = require("../models/UserReward");
const User = require("../models/User");
const Activity = require("../models/Activity");
const crypto = require("crypto");

const auth = require("../middleware/auth");

// @route   GET /api/rewards
// @desc    Get all available rewards
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { category, type } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (type) filter.type = type;

    const rewards = await Reward.find(filter).sort({ pointsCost: 1 });

    const user = await User.findById(req.user.id);

    res.json({
      rewards,
      userPoints: user.points,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/rewards/:id/redeem
// @desc    Redeem a reward
// @access  Private
router.post("/:id/redeem", auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({ msg: "Reward not found" });
    }

    const user = await User.findById(req.user.id);

    // Check if user has enough points
    if (user.points < reward.pointsCost) {
      return res.status(400).json({ msg: "Insufficient points" });
    }

    // Check stock
    if (reward.stockAvailable !== -1 && reward.stockAvailable <= 0) {
      return res.status(400).json({ msg: "Reward out of stock" });
    }

    // Deduct points
    user.points -= reward.pointsCost;
    user.stats.rewardsRedeemed += 1;
    await user.save();

    // Generate unique code
    const code = crypto.randomBytes(8).toString("hex").toUpperCase();

    // Create user reward
    const userReward = new UserReward({
      user: user._id,
      reward: reward._id,
      code,
      expiresAt: new Date(Date.now() + reward.expiryDays * 24 * 60 * 60 * 1000),
    });

    await userReward.save();

    // Update stock
    if (reward.stockAvailable !== -1) {
      reward.stockAvailable -= 1;
      await reward.save();
    }

    // Create activity
    await Activity.create({
      user: user._id,
      type: "reward_redeemed",
      title: `Redeemed: ${reward.title}`,
      description: reward.description,
      icon: reward.icon,
      points: -reward.pointsCost,
    });

    res.json({
      userReward,
      remainingPoints: user.points,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/rewards/my-rewards
// @desc    Get user's redeemed rewards
// @access  Private
router.get("/my-rewards", auth, async (req, res) => {
  try {
    const userRewards = await UserReward.find({
      user: req.user.id,
    })
      .populate("reward")
      .sort({ redeemedAt: -1 });

    res.json(userRewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/rewards
// @desc    Create a new reward (admin)
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const reward = new Reward(req.body);
    await reward.save();
    res.status(201).json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
