

const express = require('express');
const router = express.Router();  
const Problem = require('../model/problemModel');

// const { LeetCode } = require('leetcode-query');


router.get('/all', async (req, res) => {
  try {
    // Fetch all problems from the database
    const problems = await Problem.find({});
    
    if (problems.length === 0) {
      return res.status(404).json({ message: 'No problems found' });
    }

    res.status(200).json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = router;
