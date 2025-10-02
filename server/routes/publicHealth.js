const express = require("express");
const router = express.Router();
const PublicHealthCampaign = require("../models/PublicHealthCampaign");
const User = require("../models/User");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");

// @route   GET /api/public-health/campaigns
// @desc    Get all active public health campaigns
// @access  Private
router.get("/campaigns", auth, async (req, res) => {
  try {
    const campaigns = await PublicHealthCampaign.find({
      isActive: true,
      endDate: { $gte: new Date() },
    }).sort({ startDate: -1 });

    const campaignsWithUserData = campaigns.map((campaign) => {
      const userParticipation = campaign.participants.find(
        (p) => p.user && p.user.toString() === req.user.id
      );

      return {
        ...campaign.toObject(),
        isParticipating: !!userParticipation,
        userContribution: userParticipation?.contribution || 0,
        totalParticipants: campaign.participants.length,
        overallProgress:
          campaign.goals.reduce(
            (sum, goal) => sum + (goal.current / goal.target) * 100,
            0
          ) / campaign.goals.length,
      };
    });

    res.json(campaignsWithUserData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/public-health/campaigns/:id/join
// @desc    Join a public health campaign
// @access  Private
router.post("/campaigns/:id/join", auth, async (req, res) => {
  try {
    const { region } = req.body;
    const campaign = await PublicHealthCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const existing = campaign.participants.find(
      (p) => p.user && p.user.toString() === req.user.id
    );

    if (existing) {
      return res.status(400).json({ msg: "Already participating" });
    }

    campaign.participants.push({
      user: req.user.id,
      contribution: 0,
      joinedAt: Date.now(),
      region: region || "General",
    });

    // Update region stats
    const regionIndex = campaign.regions.findIndex((r) => r.name === region);
    if (regionIndex >= 0) {
      campaign.regions[regionIndex].participants += 1;
    }

    campaign.impact.peopleReached += 1;
    await campaign.save();

    await Activity.create({
      user: req.user.id,
      type: "social",
      title: `Joined Public Health Campaign: ${campaign.title}`,
      description: `Join thousands of others in improving public health!`,
      icon: campaign.icon,
      points: 0,
    });

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT /api/public-health/campaigns/:id/contribute
// @desc    Contribute to campaign goals
// @access  Private
router.put("/campaigns/:id/contribute", auth, async (req, res) => {
  try {
    const { goalIndex, amount } = req.body;
    const campaign = await PublicHealthCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const participant = campaign.participants.find(
      (p) => p.user && p.user.toString() === req.user.id
    );

    if (!participant) {
      return res
        .status(400)
        .json({ msg: "Not participating in this campaign" });
    }

    // Update goal progress
    if (campaign.goals[goalIndex]) {
      campaign.goals[goalIndex].current += amount;
      participant.contribution += amount;

      // Update region progress
      const regionIndex = campaign.regions.findIndex(
        (r) => r.name === participant.region
      );
      if (regionIndex >= 0) {
        campaign.regions[regionIndex].progress += amount;
      }
    }

    // Check if campaign goals completed
    const allGoalsCompleted = campaign.goals.every(
      (goal) => goal.current >= goal.target
    );

    if (allGoalsCompleted && campaign.status === "active") {
      campaign.status = "completed";

      // Award rewards to all participants
      for (const p of campaign.participants) {
        const user = await User.findById(p.user);
        if (user) {
          user.points += campaign.rewards.individual.points;
          await user.save();

          await Activity.create({
            user: p.user,
            type: "challenge_completed",
            title: `Campaign Completed: ${campaign.title}`,
            description: `Public health campaign successfully completed! Impact: ${campaign.impact.healthOutcomes}`,
            icon: "🏆",
            points: campaign.rewards.individual.points,
          });
        }
      }
    }

    await campaign.save();

    res.json({
      campaign,
      message: allGoalsCompleted
        ? "Campaign completed! 🎉"
        : "Contribution recorded",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/public-health/campaigns/:id/impact
// @desc    Get campaign impact statistics
// @access  Private
router.get("/campaigns/:id/impact", auth, async (req, res) => {
  try {
    const campaign = await PublicHealthCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const impactData = {
      peopleReached: campaign.impact.peopleReached,
      totalContributions: campaign.participants.reduce(
        (sum, p) => sum + p.contribution,
        0
      ),
      goalsAchieved: campaign.goals.filter((g) => g.current >= g.target).length,
      totalGoals: campaign.goals.length,
      regions: campaign.regions.map((r) => ({
        name: r.name,
        participants: r.participants,
        progress: r.progress,
      })),
      healthOutcomes: campaign.impact.healthOutcomes,
      estimatedCostSavings: campaign.impact.costSavings,
    };

    res.json(impactData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/public-health/campaigns
// @desc    Create public health campaign (admin/sponsor)
// @access  Private
router.post("/campaigns", auth, async (req, res) => {
  try {
    const campaign = new PublicHealthCampaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
