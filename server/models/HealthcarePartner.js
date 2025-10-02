const mongoose = require("mongoose");

const HealthcarePartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["doctor", "clinic", "hospital", "wellness_center", "insurance"],
    required: true,
  },
  specialization: [String],
  credentials: {
    licenseNumber: String,
    certification: [String],
    verified: Boolean,
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
  prescribedChallenges: [
    {
      challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
      },
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      prescriptionDate: Date,
      duration: Number,
      notes: String,
      status: {
        type: String,
        enum: ["active", "completed", "discontinued"],
        default: "active",
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HealthcarePartner", HealthcarePartnerSchema);
