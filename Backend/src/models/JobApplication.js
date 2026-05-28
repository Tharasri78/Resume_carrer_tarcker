const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Offer", "Rejected", "Selected"],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    followUpDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    tags: [{
      type: String,
      trim: true,
    }],

    deadline: {
      type: Date,
    },

    companyLogo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ user: 1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);