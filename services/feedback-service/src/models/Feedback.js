const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, minlength: 20 },
    category: {
      type: String,
      enum: ["Bug", "Feature Request", "Improvement", "Other"],
      default: "Other"
    },
    status: {
      type: String,
      enum: ["New", "In Review", "Resolved"],
      default: "New"
    },
    submitterName: { type: String },
    submitterEmail: { type: String },
    ai_category: { type: String },
    ai_sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"] },
    ai_priority: { type: Number, min: 1, max: 10 },
    ai_summary: { type: String },
    ai_tags: [{ type: String }],
    ai_processed: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: -1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ title: "text", ai_summary: "text" });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = { Feedback };

