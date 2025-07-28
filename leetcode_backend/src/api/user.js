const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const Problem = require('../model/problemModel');
const { LeetCode, Credential } = require('leetcode-query');

router.get('/acceptedQuestion/:username', async (req, res) => {
  const username = req.params.username;
  const sessionCookie = req.cookies['LEETCODE_SESSION'];

  if (!sessionCookie) {
    return res.status(400).json({ message: 'LEETCODE_SESSION cookie is required' });
  }

  try {
    // Auth
    const credential = new Credential();
    await credential.init(sessionCookie);
    const leetcode = new LeetCode(credential);

    // Paginate submissions
    let submissions = [];
    let offset = 0;
    const limit = 100;
    let more = true;

    while (more) {
      const batch = await leetcode.submissions({ offset, limit });
      if (!batch || batch.length === 0) break;
      submissions.push(...batch);
      more = batch.length === limit;
      offset += limit;
    }

    const accepted = [...new Set(
      submissions.filter(s => s.statusDisplay === 'Accepted').map(s => s.titleSlug)
    )];

    // Upsert user
    await User.findOneAndUpdate(
      { username },
      { username, acceptedProblems: accepted, lastSynced: new Date() },
      { upsert: true, new: true }
    );

    const problems = await Problem.find({ titleSlug: { $in: accepted } });

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error' });
  }
});

module.exports = router;
