const Analytics = require("../models/Analytics");
const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const UserReward = require("../models/UserReward");
const Activity = require("../models/Activity");

class AnalyticsService {
  // Generate daily analytics
  static async generateDailyAnalytics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Calculate metrics
      const [
        totalUsers,
        newUsers,
        activeUsers,
        challengesStarted,
        challengesCompleted,
        pointsAwarded,
        rewardsRedeemed,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
        Activity.distinct("user", {
          createdAt: { $gte: today, $lt: tomorrow },
        }).then((arr) => arr.length),
        UserProgress.countDocuments({
          startedAt: { $gte: today, $lt: tomorrow },
        }),
        UserProgress.countDocuments({
          completedAt: { $gte: today, $lt: tomorrow },
        }),
        Activity.aggregate([
          {
            $match: {
              createdAt: { $gte: today, $lt: tomorrow },
              points: { $gt: 0 },
            },
          },
          { $group: { _id: null, total: { $sum: "$points" } } },
        ]).then((res) => res[0]?.total || 0),
        UserReward.countDocuments({
          redeemedAt: { $gte: today, $lt: tomorrow },
        }),
      ]);

      const analytics = new Analytics({
        date: today,
        type: "daily",
        metrics: {
          dau: activeUsers,
          mau: 0, // Calculate separately
          newUsers,
          returningUsers: activeUsers - newUsers,
          churnRate: 0,
          avgSessionDuration: 25,
          challengesStarted,
          challengesCompleted,
          completionRate:
            challengesStarted > 0
              ? (challengesCompleted / challengesStarted) * 100
              : 0,
          pointsAwarded,
          rewardsRedeemed,
          revenueGenerated: rewardsRedeemed * 5, // Simplified calculation
        },
        engagement: {
          totalSessions: activeUsers * 2,
          avgChallengesPerUser:
            activeUsers > 0 ? challengesStarted / activeUsers : 0,
          avgPointsPerUser: activeUsers > 0 ? pointsAwarded / activeUsers : 0,
          socialInteractions: 0,
          contentShares: 0,
        },
      });

      await analytics.save();
      return analytics;
    } catch (err) {
      console.error("Error generating analytics:", err);
      throw err;
    }
  }

  // Get analytics summary
  static async getAnalyticsSummary(period = "daily", days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const analytics = await Analytics.find({
        date: { $gte: startDate },
        type: period,
      }).sort({ date: 1 });

      // Calculate totals
      const totals = analytics.reduce(
        (acc, day) => {
          acc.totalUsers += day.metrics.newUsers || 0;
          acc.totalChallenges += day.metrics.challengesCompleted || 0;
          acc.totalPoints += day.metrics.pointsAwarded || 0;
          acc.totalRevenue += day.metrics.revenueGenerated || 0;
          return acc;
        },
        {
          totalUsers: 0,
          totalChallenges: 0,
          totalPoints: 0,
          totalRevenue: 0,
        }
      );

      return {
        analytics,
        totals,
        period,
        days,
      };
    } catch (err) {
      console.error("Error getting analytics summary:", err);
      throw err;
    }
  }

  // Calculate KPIs
  static async calculateKPIs() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        totalUsers,
        activeUsers,
        avgCompletionRate,
        avgEngagementScore,
        totalRevenue,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } }),
        UserProgress.aggregate([
          { $match: { status: { $in: ["active", "completed"] } } },
          {
            $group: {
              _id: null,
              completed: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              total: { $sum: 1 },
            },
          },
        ]).then((res) =>
          res[0] ? (res[0].completed / res[0].total) * 100 : 0
        ),
        Activity.aggregate([
          { $match: { createdAt: { $gte: thirtyDaysAgo } } },
          { $group: { _id: "$user", count: { $sum: 1 } } },
          { $group: { _id: null, avg: { $avg: "$count" } } },
        ]).then((res) => res[0]?.avg || 0),
        Analytics.aggregate([
          { $match: { date: { $gte: thirtyDaysAgo } } },
          {
            $group: { _id: null, total: { $sum: "$metrics.revenueGenerated" } },
          },
        ]).then((res) => res[0]?.total || 0),
      ]);

      return {
        totalUsers,
        activeUsers,
        engagementRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
        avgCompletionRate,
        avgEngagementScore,
        totalRevenue,
        revenuePerUser: totalUsers > 0 ? totalRevenue / totalUsers : 0,
      };
    } catch (err) {
      console.error("Error calculating KPIs:", err);
      throw err;
    }
  }
}

module.exports = AnalyticsService;
