const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const Problem = require("../model/problemModel");
const { LeetCode, Credential } = require("leetcode-query");

// Get user preferences
router.get("/preferences/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      experienceLevel: user.experienceLevel || "Beginner",
      preparationGoal: user.preparationGoal || "General Practice",
      dailyTarget: user.dailyTarget || 1,
      confidentTopics: user.confidentTopics || [],
      programmingLanguages: user.programmingLanguages || ["Python"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});

// Update user preferences
router.post("/preferences/:username", async (req, res) => {
  const username = req.params.username;
  const {
    experienceLevel,
    preparationGoal,
    dailyTarget,
    confidentTopics,
    programmingLanguages,
  } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      {
        experienceLevel,
        preparationGoal,
        dailyTarget,
        confidentTopics,
        programmingLanguages,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});

// Get available options for dropdowns
router.get("/options", async (req, res) => {
  try {
    const options = {
      experienceLevels: ["Beginner", "Intermediate", "Advanced", "Expert"],
      preparationGoals: [
        "General Practice",
        "Job Interview",
        "Competitive Programming",
        "System Design",
        "Data Structures & Algorithms",
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
      ],
      dailyTargets: [1, 2, 3, 5, 10],
      confidentTopics: [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Greedy",
        "Backtracking",
        "Binary Search",
        "Two Pointers",
        "Sliding Window",
        "Stack",
        "Queue",
        "Heap",
        "Hash Table",
        "Sorting",
        "Recursion",
        "Bit Manipulation",
        "Math",
        "Geometry",
      ],
      programmingLanguages: [
        "Python",
        "Java",
        "C++",
        "C",
        "JavaScript",
        "TypeScript",
        "Go",
        "Rust",
        "Swift",
        "Kotlin",
        "C#",
        "PHP",
        "Ruby",
        "Scala",
      ],
    };

    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});

// Save LeetCode session token
router.post("/session", async (req, res) => {
  const { username, sessionToken } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { sessionToken },
      { upsert: true, new: true }
    );

    res.json({ message: "Session token saved", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});

router.post("/acceptedQuestion/:username", async (req, res) => {
  const username = req.params.username;
  const { sessionToken } = req.body;

  console.log(`📥 Sync request for user: ${username}`);
  console.log(`   Token length: ${sessionToken?.length || 0} chars`);

  if (!sessionToken) {
    return res.status(400).json({ message: "Session token is required" });
  }

  try {
    console.log(`🔄 Initializing LeetCode credential...`);
    // Auth
    const credential = new Credential();
    await credential.init(sessionToken);
    const leetcode = new LeetCode(credential);

    console.log(`📊 Fetching submissions...`);
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
      console.log(`   Fetched ${submissions.length} submissions so far...`);
    }

    const accepted = [
      ...new Set(
        submissions
          .filter((s) => s.statusDisplay === "Accepted")
          .map((s) => s.titleSlug)
      ),
    ];

    console.log(`✅ Found ${accepted.length} accepted problems`);

    // Update existing user only (don't create new)
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { acceptedProblems: accepted, lastSynced: new Date(), sessionToken },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found. Please login first." });
    }

    const problems = await Problem.find({ titleSlug: { $in: accepted } });

    console.log(`📤 Returning ${problems.length} problem details\n`);
    res.json(problems);
  } catch (error) {
    console.error("❌ Sync error:", error.message);
    res.status(500).json({ message: "Internal error", error: error.message });
  }
});

module.exports = router;
