const express = require("express");
const router = express.Router();
const Corporate = require("../models/Corporate");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const auth = require("../middleware/auth");

// @route   POST /api/corporate/register
// @desc    Register a corporate account
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { companyName, industry, size, adminEmail, plan } = req.body;

    const corporate = new Corporate({
      companyName,
      industry,
      size,
      subscription: {
        plan: plan || "basic",
        startDate: Date.now(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        status: "active",
        price: plan === "enterprise" ? 999 : plan === "premium" ? 499 : 199,
      },
      analytics: {
        totalEmployees: 0,
        activeUsers: 0,
        avgEngagementScore: 0,
        totalChallengesCompleted: 0,
        healthScoreImprovement: 0,
      },
    });

    await corporate.save();

    res.status(201).json({
      corporate,
      msg: "Corporate account created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/corporate/:id/add-employee
// @desc    Add employee to corporate account
// @access  Private
router.post("/:id/add-employee", auth, async (req, res) => {
  try {
    const { userId, department, role } = req.body;

    const corporate = await Corporate.findById(req.params.id);

    if (!corporate) {
      return res.status(404).json({ msg: "Corporate account not found" });
    }

    // Check if employee already exists
    const exists = corporate.employees.find(
      (e) => e.user.toString() === userId
    );
    if (exists) {
      return res.status(400).json({ msg: "Employee already added" });
    }

    corporate.employees.push({
      user: userId,
      department,
      role,
      joinedAt: Date.now(),
    });

    corporate.analytics.totalEmployees = corporate.employees.length;
    await corporate.save();

    // Update user with corporate info
    await User.findByIdAndUpdate(userId, {
      $set: { "profile.corporate": req.params.id },
    });

    res.json(corporate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/corporate/:id/create-competition
// @desc    Create corporate competition
// @access  Private
router.post("/:id/create-competition", auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, prize } = req.body;

    const corporate = await Corporate.findById(req.params.id);

    if (!corporate) {
      return res.status(404).json({ msg: "Corporate account not found" });
    }

    corporate.competitions.push({
      name,
      description,
      startDate,
      endDate,
      prize,
      participants: [],
      status: new Date(startDate) > Date.now() ? "upcoming" : "active",
    });

    await corporate.save();

    res.json(corporate.competitions[corporate.competitions.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/corporate/:id/dashboard
// @desc    Get corporate dashboard data
// @access  Private
router.get("/:id/dashboard", auth, async (req, res) => {
  try {
    const corporate = await Corporate.findById(req.params.id).populate(
      "employees.user",
      "username level points stats"
    );

    if (!corporate) {
      return res.status(404).json({ msg: "Corporate account not found" });
    }

    // Calculate real-time analytics
    const employees = corporate.employees.map((e) => e.user);
    const totalPoints = employees.reduce(
      (sum, user) => sum + (user.points || 0),
      0
    );
    const totalChallenges = employees.reduce(
      (sum, user) => sum + (user.stats?.challengesCompleted || 0),
      0
    );
    const avgLevel =
      employees.length > 0
        ? employees.reduce((sum, user) => sum + (user.level || 1), 0) /
          employees.length
        : 0;

    corporate.analytics.totalEmployees = corporate.employees.length;
    corporate.analytics.totalChallengesCompleted = totalChallenges;
    await corporate.save();

    res.json({
      corporate,
      insights: {
        totalPoints,
        avgLevel: Math.round(avgLevel * 10) / 10,
        totalChallenges,
        avgPointsPerEmployee:
          corporate.employees.length > 0
            ? Math.round(totalPoints / corporate.employees.length)
            : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/corporate/:id/leaderboard
// @desc    Get corporate leaderboard
// @access  Private
router.get("/:id/leaderboard", auth, async (req, res) => {
  try {
    const corporate = await Corporate.findById(req.params.id).populate({
      path: "employees.user",
      select: "username profile.avatar level points stats",
    });

    if (!corporate) {
      return res.status(404).json({ msg: "Corporate account not found" });
    }

    // Sort employees by points
    const leaderboard = corporate.employees
      .map((emp) => ({
        ...emp.toObject(),
        userPoints: emp.user?.points || 0,
      }))
      .sort((a, b) => b.userPoints - a.userPoints)
      .map((emp, index) => ({
        rank: index + 1,
        ...emp,
      }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
