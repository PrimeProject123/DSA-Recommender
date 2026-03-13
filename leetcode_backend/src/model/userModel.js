const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    sessionToken: String,
    lastSynced: Date,
    acceptedProblems: [String], // List of titleSlugs
    submissionDates: [Date], // For streak calculation
    preferences: {
      dailyTarget: { type: Number, default: 3 },
      preferredDifficulty: { type: String, default: "Medium" },
      favoriteTopics: [String],
      notifications: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false },
      experienceLevel: String,
      preparationGoal: String,
      programmingLanguages: [String],
      hasPremium: { type: Boolean, default: false },
      recommendationCount: { type: Number, default: 10 },
    },
  },
  {
    timestamps: true,
  },
);

// Index for lastSynced (username and email are already indexed via unique: true)
userSchema.index({ lastSynced: -1 });

// Calculate streak
userSchema.methods.calculateStreak = function () {
  if (!this.submissionDates || this.submissionDates.length === 0) return 0;

  // Deduplicate dates by converting to midnight timestamps and using Set
  const uniqueDates = [
    ...new Set(
      this.submissionDates.map((d) => new Date(d).setHours(0, 0, 0, 0)),
    ),
  ];
  const sortedDates = uniqueDates.sort((a, b) => b - a);

  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 24 * 60 * 60 * 1000;

  // If no submission today or yesterday, streak is 0
  if (sortedDates[0] < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i - 1] - sortedDates[i];
    if (diff === 24 * 60 * 60 * 1000) {
      streak++;
    } else if (diff > 24 * 60 * 60 * 1000) {
      break;
    }
  }

  return streak;
};

module.exports = mongoose.model("User", userSchema);
