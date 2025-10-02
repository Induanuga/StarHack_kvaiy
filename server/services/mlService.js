const UserBehavior = require("../models/UserBehavior");
const Challenge = require("../models/Challenge");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");

class MLService {
  // Analyze user behavior and update patterns
  static async analyzeUserBehavior(userId) {
    try {
      const user = await User.findById(userId);
      const completedChallenges = await UserProgress.find({
        user: userId,
        status: "completed",
      }).populate("challenge");

      const activeChallenges = await UserProgress.find({
        user: userId,
        status: "active",
      }).populate("challenge");

      // Calculate patterns
      const patterns = this.calculatePatterns(completedChallenges);

      // Update or create behavior profile
      let behavior = await UserBehavior.findOne({ user: userId });

      if (!behavior) {
        behavior = new UserBehavior({ user: userId });
      }

      behavior.activityPattern = patterns;
      behavior.challengeHistory = completedChallenges.map((cp) => ({
        category: cp.challenge.category,
        difficulty: cp.challenge.difficulty,
        completed: true,
        timeToComplete: this.calculateDays(cp.startedAt, cp.completedAt),
        timestamp: cp.completedAt,
      }));
      behavior.lastAnalyzed = Date.now();

      await behavior.save();

      return behavior;
    } catch (err) {
      console.error("Error analyzing user behavior:", err);
      throw err;
    }
  }

  // Calculate user activity patterns
  static calculatePatterns(challenges) {
    if (challenges.length === 0) {
      return {
        mostActiveTime: "morning",
        mostActiveDay: "monday",
        averageSessionDuration: 30,
        preferredCategories: ["health"],
        completionRate: 0,
        averageTimeToComplete: 7,
      };
    }

    // Count categories
    const categoryCount = {};
    let totalTime = 0;

    challenges.forEach((cp) => {
      const cat = cp.challenge.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;

      if (cp.completedAt && cp.startedAt) {
        totalTime += this.calculateDays(cp.startedAt, cp.completedAt);
      }
    });

    // Get preferred categories
    const preferredCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    return {
      mostActiveTime: "evening", // Could be calculated from activity logs
      mostActiveDay: "monday",
      averageSessionDuration: 25,
      preferredCategories,
      completionRate: (challenges.length / (challenges.length + 2)) * 100, // Simplified
      averageTimeToComplete: totalTime / challenges.length || 7,
    };
  }

  // Predict challenges for user using simple rule-based ML
  static async predictChallenges(userId) {
    try {
      const behavior = await UserBehavior.findOne({ user: userId });

      if (!behavior) {
        // New user - recommend beginner challenges
        return await this.getBeginnerChallenges();
      }

      const predictions = [];
      const allChallenges = await Challenge.find({ isActive: true });
      const userProgress = await UserProgress.find({ user: userId });
      const completedChallengeIds = userProgress
        .filter((p) => p.status === "completed")
        .map((p) => p.challenge.toString());

      for (const challenge of allChallenges) {
        // Skip if already completed
        if (completedChallengeIds.includes(challenge._id.toString())) continue;

        const confidence = this.calculateConfidence(challenge, behavior);
        const reason = this.generateReason(challenge, behavior);

        if (confidence > 50) {
          predictions.push({
            challenge: challenge._id,
            confidence,
            reason,
            suggestedAt: Date.now(),
          });
        }
      }

      // Sort by confidence
      predictions.sort((a, b) => b.confidence - a.confidence);

      // Update user behavior with predictions
      behavior.predictedChallenges = predictions.slice(0, 10);
      await behavior.save();

      return predictions.slice(0, 5);
    } catch (err) {
      console.error("Error predicting challenges:", err);
      throw err;
    }
  }

  // Calculate confidence score for a challenge
  static calculateConfidence(challenge, behavior) {
    let confidence = 50; // Base confidence

    // Prefer challenges in user's preferred categories
    if (
      behavior.activityPattern.preferredCategories.includes(challenge.category)
    ) {
      confidence += 30;
    }

    // Match difficulty based on completion rate
    if (
      behavior.activityPattern.completionRate > 80 &&
      challenge.difficulty === "hard"
    ) {
      confidence += 15;
    } else if (
      behavior.activityPattern.completionRate < 50 &&
      challenge.difficulty === "easy"
    ) {
      confidence += 20;
    } else if (challenge.difficulty === "medium") {
      confidence += 10;
    }

    // Consider challenge type
    if (
      challenge.type === "daily" &&
      behavior.activityPattern.completionRate > 70
    ) {
      confidence += 10;
    }

    return Math.min(confidence, 100);
  }

  // Generate reason for recommendation
  static generateReason(challenge, behavior) {
    const reasons = [];

    if (
      behavior.activityPattern.preferredCategories.includes(challenge.category)
    ) {
      reasons.push(`Matches your interest in ${challenge.category}`);
    }

    if (behavior.activityPattern.completionRate > 80) {
      reasons.push("Based on your high success rate");
    }

    if (challenge.type === "daily") {
      reasons.push("Great for building daily habits");
    }

    return reasons.join(". ") || "Recommended for you";
  }

  // Get beginner challenges for new users
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

  // Calculate days between dates
  static calculateDays(start, end) {
    return Math.floor(
      (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    );
  }
}

module.exports = MLService;
