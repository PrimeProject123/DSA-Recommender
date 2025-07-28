const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  questionId: Number,
  title: String,
  titleSlug: String,
  difficulty: String,
  frontendQuestionId: String,
  acRate: Number,
  tags: [String],
});

module.exports = mongoose.model('Problem', problemSchema);
