const express = require('express');
const router = express.Router();
const Problem = require('../model/problemModel');
const { LeetCode } = require('leetcode-query');

// Sync all LeetCode problems into MongoDB
router.get('/sync/problems', async (req, res) => {
  try {
    const leetcode = new LeetCode();

    const allProblemsData = [];
    let flag = true;
    while (flag) {
      const page = await leetcode.problems({ offset: allProblemsData.length, limit: 1000});
      console.log(`Fetched ${allProblemsData.length + page.questions.length} problems...`);
      if (!page || page.questions.length === 0) {
        flag = false;
      } else {
        allProblemsData.push(...page.questions);
      }
    }
    
    console.log(await Problem.countDocuments());
    
    await Problem.deleteMany();
    
    console.log(await Problem.countDocuments());


    const bulk = allProblemsData.map(q => ({
      questionId: q.frontendQuestionId,
      title: q.title,
      titleSlug: q.titleSlug,
      difficulty: q.difficulty,
      frontendQuestionId: q.questionFrontendId,
      acRate: q.acRate,
      tags: q.topicTags.map(t => t.name),
    }));

    await Problem.insertMany(bulk);

    res.status(200).json({ message: 'Problems synced successfully' });
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

module.exports = router;
