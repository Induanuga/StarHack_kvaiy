const express = require("express");
const router = express.Router();
const HealthcarePartner = require("../models/HealthcarePartner");
const Challenge = require("../models/Challenge");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");

// @route   GET /api/healthcare/partners
// @desc    Get all healthcare partners
// @access  Private
router.get("/partners", auth, async (req, res) => {
  try {
    const partners = await HealthcarePartner.find({ isActive: true }).select(
      "-prescribedChallenges"
    );

    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/healthcare/my-prescriptions
// @desc    Get user's prescribed challenges
// @access  Private
router.get("/my-prescriptions", auth, async (req, res) => {
  try {
    const prescriptions = await HealthcarePartner.find({
      "prescribedChallenges.patient": req.user.id,
      "prescribedChallenges.status": "active",
    }).populate("prescribedChallenges.challenge");

    const userPrescriptions = [];

    prescriptions.forEach((partner) => {
      partner.prescribedChallenges.forEach((pc) => {
        if (pc.patient.toString() === req.user.id && pc.status === "active") {
          userPrescriptions.push({
            ...pc.toObject(),
            partner: {
              name: partner.name,
              type: partner.type,
              specialization: partner.specialization,
            },
          });
        }
      });
    });

    res.json(userPrescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/healthcare/prescribe
// @desc    Healthcare provider prescribes a challenge
// @access  Private (requires healthcare provider authentication)
router.post("/prescribe", auth, async (req, res) => {
  try {
    const { partnerId, patientId, challengeId, duration, notes } = req.body;

    const partner = await HealthcarePartner.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ msg: "Healthcare partner not found" });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    // Add prescription
    partner.prescribedChallenges.push({
      challenge: challengeId,
      patient: patientId,
      prescriptionDate: Date.now(),
      duration,
      notes,
      status: "active",
    });

    await partner.save();

    // Auto-join the challenge for the patient
    const progress = new UserProgress({
      user: patientId,
      challenge: challengeId,
      target: challenge.target,
      status: "active",
    });

    await progress.save();

    // Notify patient
    await Activity.create({
      user: patientId,
      type: "challenge_completed",
      title: `New Health Challenge Prescribed`,
      description: `Dr. ${partner.name} has prescribed: ${challenge.title}`,
      icon: "🏥",
      points: 0,
      metadata: {
        prescribedBy: partner.name,
        notes,
      },
    });

    res.json({
      msg: "Challenge prescribed successfully",
      prescription:
        partner.prescribedChallenges[partner.prescribedChallenges.length - 1],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
