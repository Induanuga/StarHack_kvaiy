const axios = require("axios");
const UserBehavior = require("../models/UserBehavior");
const Challenge = require("../models/Challenge");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

class MLService {
  // Analyze user behavior using Python ML service
  static async analyzeUserBehavior(userId) {
    try {
      const user = await User.findById(userId);
      const completedChallenges = await UserProgress.find({
        user: userId,
        status: "completed",
      }).populate("challenge");

      const challengeHistory = completedChallenges.map((cp) => ({
        category: cp.challenge.category,
        difficulty: cp.challenge.difficulty,
        completed: true,
        timeToComplete: this.calculateDays(cp.startedAt, cp.completedAt),
        timestamp: cp.completedAt,
      }));

      // Call Python ML service
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/analyze-behavior`,
        {
          userId: userId.toString(),
          challengeHistory,
        }
      );

      const patterns = response.data.patterns;

      // Update or create behavior profile
      let behavior = await UserBehavior.findOne({ user: userId });

      if (!behavior) {
        behavior = new UserBehavior({ user: userId });
      }

      behavior.activityPattern = {
        mostActiveTime: patterns.mostActiveTime,
        mostActiveDay: "monday",
        averageSessionDuration: 25,
        preferredCategories: patterns.preferredCategories,
        completionRate: patterns.completionRate,
        averageTimeToComplete: patterns.averageTimeToComplete,
      };
      behavior.challengeHistory = challengeHistory;
      behavior.lastAnalyzed = Date.now();

      await behavior.save();

      return behavior;
    } catch (err) {
      console.error("Error analyzing user behavior:", err.message);
      // Fallback to simple analysis
      return await this.simpleBehaviorAnalysis(userId);
    }
  }

  // Simple fallback when Python service unavailable
  static async simpleBehaviorAnalysis(userId) {
    const completedChallenges = await UserProgress.find({
      user: userId,
      status: "completed",
    }).populate("challenge");

    const categoryCount = {};
    completedChallenges.forEach((cp) => {
      const cat = cp.challenge.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const preferredCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    let behavior = await UserBehavior.findOne({ user: userId });

    if (!behavior) {
      behavior = new UserBehavior({ user: userId });
    }

    behavior.activityPattern = {
      mostActiveTime: "evening",
      mostActiveDay: "monday",
      averageSessionDuration: 25,
      preferredCategories:
        preferredCategories.length > 0 ? preferredCategories : ["health"],
      completionRate: 0,
      averageTimeToComplete: 7,
    };

    await behavior.save();
    return behavior;
  }

  // Get AI-powered challenge recommendations
  static async predictChallenges(userId) {
    try {
      const behavior = await UserBehavior.findOne({ user: userId });

      if (!behavior) {
        return await this.getBeginnerChallenges();
      }

      const user = await User.findById(userId);
      const allChallenges = await Challenge.find({ isActive: true });
      const userProgress = await UserProgress.find({ user: userId });
      const completedChallengeIds = userProgress
        .filter((p) => p.status === "completed")
        .map((p) => p.challenge.toString());

      // Filter out completed challenges
      const availableChallenges = allChallenges
        .filter((c) => !completedChallengeIds.includes(c._id.toString()))
        .map((c) => c.toObject());

      const userProfile = {
        level: user.level,
        points: user.points,
        stats: {
          completionRate: behavior.activityPattern.completionRate,
        },
        preferredCategories: behavior.activityPattern.preferredCategories,
        avgTimeToComplete: behavior.activityPattern.averageTimeToComplete,
        streak: user.streak,
      };

      // Call Python ML service
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/ml/recommend-challenges`,
        {
          userId: userId.toString(),
          userProfile,
          availableChallenges,
        }
      );

      const recommendations = response.data.recommendations.map((rec) => ({
        challenge: rec.challengeId,
        confidence: rec.confidence,
        reason: rec.reason,
        suggestedAt: Date.now(),
      }));

      // Update user behavior with predictions
      behavior.predictedChallenges = recommendations;
      await behavior.save();

      return recommendations;
    } catch (err) {
      console.error("Error getting ML recommendations:", err.message);
      // Fallback to rule-based
      return await this.ruleBasedRecommendations(userId);
    }
  }

  // Fallback rule-based recommendations
  static async ruleBasedRecommendations(userId) {
    const behavior = await UserBehavior.findOne({ user: userId });

    if (!behavior) {
      return await this.getBeginnerChallenges();
    }

    const allChallenges = await Challenge.find({ isActive: true });
    const userProgress = await UserProgress.find({ user: userId });
    const completedChallengeIds = userProgress
      .filter((p) => p.status === "completed")
      .map((p) => p.challenge.toString());

    const predictions = [];

    for (const challenge of allChallenges) {
      if (completedChallengeIds.includes(challenge._id.toString())) continue;

      let confidence = 50;

      if (
        behavior.activityPattern.preferredCategories.includes(
          challenge.category
        )
      ) {
        confidence += 30;
      }

      if (confidence > 50) {
        predictions.push({
          challenge: challenge._id,
          confidence,
          reason: `Matches your interest in ${challenge.category}`,
          suggestedAt: Date.now(),
        });
      }
    }

    predictions.sort((a, b) => b.confidence - a.confidence);
    return predictions.slice(0, 10);
  }

  static async getBeginnerChallenges() {
    const challenges = await Challenge.find({
      isActive: true,
      difficulty: "easy",
      type: "daily",
    }).limit(5);

    return challenges.map((c) => ({
      challenge: c._id,
      confidence: 70,
      reason: "Perfect for beginners",
      suggestedAt: Date.now(),
    }));
  }

  static calculateDays(start, end) {
    return Math.floor(
      (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    );
  }
}

module.exports = MLService;
