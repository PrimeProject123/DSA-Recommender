const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  questionId: Number,
  title: String,
  titleSlug: String,
  difficulty: String,
  frontendQuestionId: String,
  acRate: Number,
  tags: [String],
  isPaidOnly: { type: Boolean, default: false },
});

// Indexes for performance
problemSchema.index({ titleSlug: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ frontendQuestionId: 1 });
problemSchema.index({ acRate: -1 });
// Compound indexes for common queries
problemSchema.index({ difficulty: 1, tags: 1 });
problemSchema.index({ tags: 1, acRate: -1 });

module.exports = mongoose.model("Problem", problemSchema);
