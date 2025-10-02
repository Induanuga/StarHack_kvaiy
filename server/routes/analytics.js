const express = require("express");
const router = express.Router();
const AnalyticsService = require("../services/analyticsService");
const Analytics = require("../models/Analytics");
const auth = require("../middleware/auth");

// Middleware to check admin access
const isAdmin = (req, res, next) => {
  // In production, check if user is admin
  // For now, allow all authenticated users
  next();
};

// @route   GET /api/analytics/kpis
// @desc    Get key performance indicators
// @access  Private/Admin
router.get("/kpis", auth, isAdmin, async (req, res) => {
  try {
    const kpis = await AnalyticsService.calculateKPIs();
    res.json(kpis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/analytics/summary
// @desc    Get analytics summary
// @access  Private/Admin
router.get("/summary", auth, isAdmin, async (req, res) => {
  try {
    const { period = "daily", days = 7 } = req.query;
    const summary = await AnalyticsService.getAnalyticsSummary(
      period,
      parseInt(days)
    );
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/analytics/generate
// @desc    Generate daily analytics (cron job endpoint)
// @access  Private/Admin
router.post("/generate", auth, isAdmin, async (req, res) => {
  try {
    const analytics = await AnalyticsService.generateDailyAnalytics();
    res.json({
      msg: "Analytics generated successfully",
      analytics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get("/dashboard", auth, isAdmin, async (req, res) => {
  try {
    const [kpis, summary] = await Promise.all([
      AnalyticsService.calculateKPIs(),
      AnalyticsService.getAnalyticsSummary("daily", 30),
    ]);

    res.json({
      kpis,
      summary,
      charts: {
        userGrowth: summary.analytics.map((a) => ({
          date: a.date,
          value: a.metrics.newUsers,
        })),
        engagement: summary.analytics.map((a) => ({
          date: a.date,
          value: a.metrics.dau,
        })),
        revenue: summary.analytics.map((a) => ({
          date: a.date,
          value: a.metrics.revenueGenerated,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
