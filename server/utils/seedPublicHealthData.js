const PublicHealthCampaign = require("../models/PublicHealthCampaign");

const publicHealthCampaigns = [
  {
    title: "National Vaccination Drive 2024",
    description: "Join millions in getting vaccinated to protect our community",
    sponsor: {
      name: "Ministry of Health",
      type: "government",
      logo: "🏛️",
    },
    category: "vaccination",
    goals: [
      {
        metric: "Vaccinations Completed",
        target: 1000000,
        current: 0,
        unit: "people",
      },
      {
        metric: "Awareness Sessions",
        target: 10000,
        current: 0,
        unit: "sessions",
      },
    ],
    participants: [],
    rewards: {
      individual: {
        points: 500,
        badge: "Health Guardian",
        certificate: true,
      },
      community: {
        description: "Free health screening for entire community",
        unlockThreshold: 1000000,
      },
    },
    regions: [
      { name: "North", participants: 0, progress: 0 },
      { name: "South", participants: 0, progress: 0 },
      { name: "East", participants: 0, progress: 0 },
      { name: "West", participants: 0, progress: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    status: "active",
    impact: {
      peopleReached: 0,
      healthOutcomes: "Prevent 50,000 disease cases",
      costSavings: 10000000,
    },
    educationalContent: [
      {
        title: "Why Vaccination Matters",
        content:
          "Vaccines save lives by protecting against serious diseases...",
        type: "article",
      },
    ],
    icon: "💉",
    color: "#10b981",
    isActive: true,
  },
  {
    title: "Mental Health Awareness Month",
    description: "Break the stigma, start the conversation about mental health",
    sponsor: {
      name: "Mental Health Foundation",
      type: "ngo",
      logo: "🧠",
    },
    category: "mental_health",
    goals: [
      {
        metric: "Mental Health Check-ins",
        target: 500000,
        current: 0,
        unit: "check-ins",
      },
      {
        metric: "Support Groups Formed",
        target: 5000,
        current: 0,
        unit: "groups",
      },
      {
        metric: "Meditation Minutes",
        target: 10000000,
        current: 0,
        unit: "minutes",
      },
    ],
    participants: [],
    rewards: {
      individual: {
        points: 300,
        badge: "Mental Wellness Advocate",
        certificate: true,
      },
      community: {
        description: "Free mental health counseling sessions",
        unlockThreshold: 500000,
      },
    },
    regions: [
      { name: "Urban", participants: 0, progress: 0 },
      { name: "Rural", participants: 0, progress: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active",
    impact: {
      peopleReached: 0,
      healthOutcomes: "Reduce mental health crisis by 30%",
      costSavings: 5000000,
    },
    educationalContent: [
      {
        title: "Understanding Mental Health",
        content: "Mental health is as important as physical health...",
        type: "article",
      },
    ],
    icon: "🧘",
    color: "#8b5cf6",
    isActive: true,
  },
  {
    title: "Smoke-Free Nation Initiative",
    description: "Help create a tobacco-free generation",
    sponsor: {
      name: "Public Health Department",
      type: "government",
      logo: "🚭",
    },
    category: "smoking_cessation",
    goals: [
      {
        metric: "People Quit Smoking",
        target: 100000,
        current: 0,
        unit: "people",
      },
      { metric: "Smoke-Free Days", target: 3000000, current: 0, unit: "days" },
    ],
    participants: [],
    rewards: {
      individual: {
        points: 1000,
        badge: "Smoke-Free Champion",
        certificate: true,
      },
      community: {
        description: "Smoke-free parks and public spaces",
        unlockThreshold: 100000,
      },
    },
    regions: [
      { name: "Metro", participants: 0, progress: 0 },
      { name: "Suburban", participants: 0, progress: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: "active",
    impact: {
      peopleReached: 0,
      healthOutcomes: "Prevent 20,000 smoking-related deaths",
      costSavings: 50000000,
    },
    educationalContent: [
      {
        title: "Quitting Smoking: Your Journey",
        content: "Every cigarette not smoked is a victory...",
        type: "article",
      },
    ],
    icon: "🚭",
    color: "#ef4444",
    isActive: true,
  },
];

const seedPublicHealthData = async () => {
  try {
    await PublicHealthCampaign.deleteMany({});
    await PublicHealthCampaign.insertMany(publicHealthCampaigns);
    console.log("✅ Public health campaigns seeded");
  } catch (err) {
    console.error("Error seeding public health data:", err);
  }
};

module.exports = { seedPublicHealthData, publicHealthCampaigns };
