const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const Problem = require('../model/problemModel');
const { LeetCode, Credential } = require('leetcode-query');

// Get user preferences
router.get('/preferences/:username', async (req, res) => {
  const username = req.params.username;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      experienceLevel: user.experienceLevel || 'Beginner',
      preparationGoal: user.preparationGoal || 'General Practice',
      dailyTarget: user.dailyTarget || 1,
      confidentTopics: user.confidentTopics || [],
      programmingLanguages: user.programmingLanguages || ['Python']
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update user preferences
router.post('/preferences/:username', async (req, res) => {
  const username = req.params.username;
  const { experienceLevel, preparationGoal, dailyTarget, confidentTopics, programmingLanguages } = req.body;
  
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { 
        experienceLevel, 
        preparationGoal, 
        dailyTarget, 
        confidentTopics, 
        programmingLanguages,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get available options for dropdowns
router.get('/options', async (req, res) => {
  try {
    const options = {
      experienceLevels: [
        'Beginner',
        'Intermediate', 
        'Advanced',
        'Expert'
      ],
      preparationGoals: [
        'General Practice',
        'Job Interview',
        'Competitive Programming',
        'System Design',
        'Data Structures & Algorithms',
        'Frontend Development',
        'Backend Development',
        'Full Stack Development'
      ],
      dailyTargets: [1, 2, 3, 5, 10],
      confidentTopics: [
        'Arrays',
        'Strings',
        'Linked Lists',
        'Trees',
        'Graphs',
        'Dynamic Programming',
        'Greedy',
        'Backtracking',
        'Binary Search',
        'Two Pointers',
        'Sliding Window',
        'Stack',
        'Queue',
        'Heap',
        'Hash Table',
        'Sorting',
        'Recursion',
        'Bit Manipulation',
        'Math',
        'Geometry'
      ],
      programmingLanguages: [
        'Python',
        'Java',
        'C++',
        'C',
        'JavaScript',
        'TypeScript',
        'Go',
        'Rust',
        'Swift',
        'Kotlin',
        'C#',
        'PHP',
        'Ruby',
        'Scala'
      ]
    };
    
    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal error' });
  }
});

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
