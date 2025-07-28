const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  lastSynced: Date,
  acceptedProblems: [String], // List of titleSlugs
});

module.exports = mongoose.model('User', userSchema);

