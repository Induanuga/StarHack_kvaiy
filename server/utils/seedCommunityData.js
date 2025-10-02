const CommunityChallenge = require("../models/CommunityChallenge");

const communityChallenges = [
  {
    title: "Global Step Challenge",
    description: "Let's walk 10 million steps together as a community!",
    category: "health",
    type: "global",
    goal: 10000000,
    unit: "steps",
    currentProgress: 0,
    rewards: {
      points: 200,
      badge: "Global Walker",
      specialReward: "Exclusive community badge",
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active",
    icon: "🚶‍♂️",
    color: "#10b981",
    milestones: [
      { threshold: 2500000, reached: false, bonus: 50 },
      { threshold: 5000000, reached: false, bonus: 100 },
      { threshold: 7500000, reached: false, bonus: 150 },
      { threshold: 10000000, reached: false, bonus: 200 },
    ],
  },
  {
    title: "Community Savings Goal",
    description: "Save $100,000 collectively this month!",
    category: "wealth",
    type: "community",
    goal: 100000,
    unit: "dollars",
    currentProgress: 0,
    rewards: {
      points: 300,
      badge: "Wealth Builder",
      specialReward: "Financial wellness webinar access",
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active",
    icon: "💰",
    color: "#f59e0b",
    milestones: [
      { threshold: 25000, reached: false, bonus: 75 },
      { threshold: 50000, reached: false, bonus: 150 },
      { threshold: 75000, reached: false, bonus: 225 },
      { threshold: 100000, reached: false, bonus: 300 },
    ],
  },
  {
    title: "Meditation Marathon",
    description: "Complete 100,000 minutes of meditation as a community",
    category: "health",
    type: "community",
    goal: 100000,
    unit: "minutes",
    currentProgress: 0,
    rewards: {
      points: 250,
      badge: "Mindful Master",
      specialReward: "Premium meditation content",
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active",
    icon: "🧘",
    color: "#8b5cf6",
    milestones: [
      { threshold: 25000, reached: false, bonus: 60 },
      { threshold: 50000, reached: false, bonus: 120 },
      { threshold: 75000, reached: false, bonus: 180 },
      { threshold: 100000, reached: false, bonus: 250 },
    ],
  },
];

const seedCommunityData = async () => {
  try {
    await CommunityChallenge.deleteMany({});
    await CommunityChallenge.insertMany(communityChallenges);
    console.log("✅ Community challenges seeded");
  } catch (err) {
    console.error("Error seeding community data:", err);
  }
};

module.exports = { seedCommunityData, communityChallenges };
