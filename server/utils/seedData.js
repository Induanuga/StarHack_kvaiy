const Challenge = require("../models/Challenge");
const Achievement = require("../models/Achievement");
const Reward = require("../models/Reward");

const defaultChallenges = [
  // Daily Challenges
  {
    title: "Morning Walk",
    description: "Walk 10,000 steps today",
    category: "health",
    type: "daily",
    difficulty: "easy",
    points: 50,
    xpReward: 100,
    target: 10000,
    unit: "steps",
    icon: "🚶",
    color: "#10b981",
    isActive: true,
  },
  {
    title: "Water Intake",
    description: "Drink 8 glasses of water",
    category: "health",
    type: "daily",
    difficulty: "easy",
    points: 30,
    xpReward: 50,
    target: 8,
    unit: "glasses",
    icon: "💧",
    color: "#3b82f6",
    isActive: true,
  },
  {
    title: "Budget Tracker",
    description: "Log your daily expenses",
    category: "financial",
    type: "daily",
    difficulty: "easy",
    points: 40,
    xpReward: 80,
    target: 1,
    unit: "task",
    icon: "💰",
    color: "#f59e0b",
    isActive: true,
  },

  // Weekly Challenges
  {
    title: "Workout Warrior",
    description: "Complete 5 workout sessions this week",
    category: "health",
    type: "weekly",
    difficulty: "medium",
    points: 200,
    xpReward: 500,
    target: 5,
    unit: "sessions",
    icon: "💪",
    color: "#ef4444",
    isActive: true,
  },
  {
    title: "Savings Goal",
    description: "Save $100 this week",
    category: "wealth",
    type: "weekly",
    difficulty: "medium",
    points: 150,
    xpReward: 400,
    target: 100,
    unit: "dollars",
    icon: "🏦",
    color: "#8b5cf6",
    isActive: true,
  },
  {
    title: "Policy Review",
    description: "Review your insurance policies",
    category: "insurance",
    type: "weekly",
    difficulty: "easy",
    points: 100,
    xpReward: 200,
    target: 1,
    unit: "task",
    icon: "🛡️",
    color: "#06b6d4",
    isActive: true,
  },

  // Monthly Challenges
  {
    title: "Marathon Month",
    description: "Run 50 kilometers this month",
    category: "health",
    type: "monthly",
    difficulty: "hard",
    points: 500,
    xpReward: 1500,
    target: 50,
    unit: "km",
    icon: "🏃",
    color: "#ec4899",
    isActive: true,
  },
  {
    title: "Investment Start",
    description: "Make your first investment",
    category: "wealth",
    type: "monthly",
    difficulty: "medium",
    points: 300,
    xpReward: 800,
    target: 1,
    unit: "investment",
    icon: "📈",
    color: "#10b981",
    isActive: true,
  },

  // Community Challenges
  {
    title: "Family Fitness",
    description: "Exercise with family members",
    category: "social",
    type: "weekly",
    difficulty: "medium",
    points: 250,
    xpReward: 600,
    target: 3,
    unit: "sessions",
    icon: "👨‍👩‍👧‍👦",
    color: "#f59e0b",
    isActive: true,
  },
  {
    title: "Wellness Share",
    description: "Share health tips with friends",
    category: "social",
    type: "weekly",
    difficulty: "easy",
    points: 80,
    xpReward: 150,
    target: 5,
    unit: "shares",
    icon: "🤝",
    color: "#6366f1",
    isActive: true,
  },

  // Aktivo Integration
  {
    title: "Aktivo Score Boost",
    description: "Improve your Aktivo health score",
    category: "aktivo",
    type: "weekly",
    difficulty: "medium",
    points: 180,
    xpReward: 450,
    target: 10,
    unit: "points",
    icon: "⚡",
    color: "#f43f5e",
    isActive: true,
  },
];

const defaultAchievements = [
  // Health Achievements
  {
    title: "First Steps",
    description: "Complete your first health challenge",
    icon: "🎯",
    category: "health",
    rarity: "common",
    requirement: "challenges_completed",
    threshold: 1,
    points: 100,
    badge: "🥉",
  },
  {
    title: "Health Enthusiast",
    description: "Complete 10 health challenges",
    icon: "💪",
    category: "health",
    rarity: "rare",
    requirement: "challenges_completed",
    threshold: 10,
    points: 500,
    badge: "🥈",
  },
  {
    title: "Wellness Master",
    description: "Complete 50 health challenges",
    icon: "🏆",
    category: "health",
    rarity: "epic",
    requirement: "challenges_completed",
    threshold: 50,
    points: 2000,
    badge: "🥇",
  },

  // Wealth Achievements
  {
    title: "Penny Saver",
    description: "Complete your first wealth challenge",
    icon: "💵",
    category: "wealth",
    rarity: "common",
    requirement: "wealth_challenges",
    threshold: 1,
    points: 100,
    badge: "💰",
  },
  {
    title: "Financial Guru",
    description: "Complete 20 wealth challenges",
    icon: "💎",
    category: "wealth",
    rarity: "epic",
    requirement: "wealth_challenges",
    threshold: 20,
    points: 1500,
    badge: "👑",
  },

  // Milestone Achievements
  {
    title: "Level 10",
    description: "Reach level 10",
    icon: "⭐",
    category: "milestone",
    rarity: "rare",
    requirement: "level",
    threshold: 10,
    points: 1000,
    badge: "🌟",
  },
  {
    title: "Point Collector",
    description: "Earn 10,000 points",
    icon: "💎",
    category: "milestone",
    rarity: "epic",
    requirement: "total_points",
    threshold: 10000,
    points: 2000,
    badge: "💫",
  },

  // Social Achievements
  {
    title: "Team Player",
    description: "Complete 5 social challenges",
    icon: "🤝",
    category: "social",
    rarity: "rare",
    requirement: "social_challenges",
    threshold: 5,
    points: 500,
    badge: "👥",
  },
  {
    title: "Community Leader",
    description: "Help 10 family members",
    icon: "👨‍👩‍👧‍👦",
    category: "social",
    rarity: "legendary",
    requirement: "family_helped",
    threshold: 10,
    points: 3000,
    badge: "🏅",
  },
];

const defaultRewards = [
  // Health Rewards
  {
    title: "Gym Membership Discount",
    description: "20% off on annual gym membership",
    type: "discount",
    category: "health",
    pointsCost: 500,
    value: 20,
    icon: "🏋️",
    image: null,
    stockAvailable: -1,
    expiryDays: 30,
    isActive: true,
    partnerName: "FitLife Gym",
    termsAndConditions: "Valid for new memberships only",
  },
  {
    title: "Fitness Tracker",
    description: "Get a free fitness tracking device",
    type: "merchandise",
    category: "health",
    pointsCost: 2000,
    value: 50,
    icon: "⌚",
    stockAvailable: 50,
    expiryDays: 60,
    isActive: true,
    partnerName: "TechFit",
    termsAndConditions: "Subject to availability",
  },

  // Wealth Rewards
  {
    title: "Financial Consultation",
    description: "Free 1-hour session with financial advisor",
    type: "voucher",
    category: "wealth",
    pointsCost: 800,
    value: 100,
    icon: "📊",
    stockAvailable: -1,
    expiryDays: 90,
    isActive: true,
    partnerName: "WealthWise",
    termsAndConditions: "Book within 30 days",
  },
  {
    title: "$50 Cashback",
    description: "Instant cashback to your account",
    type: "cashback",
    category: "wealth",
    pointsCost: 5000,
    value: 50,
    icon: "💵",
    stockAvailable: 100,
    expiryDays: 7,
    isActive: true,
    partnerName: "YouMatter",
    termsAndConditions: "Processed within 5 business days",
  },

  // Insurance Rewards
  {
    title: "Premium Discount",
    description: "10% off on next insurance premium",
    type: "discount",
    category: "insurance",
    pointsCost: 1000,
    value: 10,
    icon: "🛡️",
    stockAvailable: -1,
    expiryDays: 180,
    isActive: true,
    partnerName: "SecureLife Insurance",
    termsAndConditions: "Valid for policy renewal",
  },

  // Lifestyle Rewards
  {
    title: "Coffee Gift Card",
    description: "$25 gift card for your favorite café",
    type: "voucher",
    category: "lifestyle",
    pointsCost: 250,
    value: 25,
    icon: "☕",
    stockAvailable: 200,
    expiryDays: 90,
    isActive: true,
    partnerName: "Bean There",
    termsAndConditions: "Valid at all locations",
  },
  {
    title: "Movie Tickets",
    description: "2 free movie tickets",
    type: "voucher",
    category: "lifestyle",
    pointsCost: 400,
    value: 30,
    icon: "🎬",
    stockAvailable: 150,
    expiryDays: 60,
    isActive: true,
    partnerName: "CineMax",
    termsAndConditions: "Standard shows only",
  },

  // Premium Rewards
  {
    title: "YouMatter Premium",
    description: "1 month of premium features",
    type: "premium",
    category: "premium",
    pointsCost: 3000,
    value: 49,
    icon: "👑",
    stockAvailable: -1,
    expiryDays: 30,
    isActive: true,
    partnerName: "YouMatter",
    termsAndConditions: "Auto-renew can be cancelled anytime",
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Challenge.deleteMany({});
    await Achievement.deleteMany({});
    await Reward.deleteMany({});

    // Insert default data
    await Challenge.insertMany(defaultChallenges);
    await Achievement.insertMany(defaultAchievements);
    await Reward.insertMany(defaultRewards);

    console.log("✅ Database seeded successfully!");
    console.log(`📋 ${defaultChallenges.length} challenges created`);
    console.log(`🏆 ${defaultAchievements.length} achievements created`);
    console.log(`🎁 ${defaultRewards.length} rewards created`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

module.exports = {
  seedDatabase,
  defaultChallenges,
  defaultAchievements,
  defaultRewards,
};
