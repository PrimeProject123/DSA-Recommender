const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const Problem = require("../model/problemModel");
const { authenticate } = require("../middleware/auth");

// Escape special regex characters to prevent ReDoS
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get user profile (authenticated)
router.get("/profile/:username", authenticate, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get problem details for accepted problems
    const acceptedProblemDocs = await Problem.find({
      titleSlug: { $in: user.acceptedProblems || [] },
    });

    // Calculate difficulty stats
    const difficultyStats = {
      easy: acceptedProblemDocs.filter((p) => p.difficulty === "Easy").length,
      medium: acceptedProblemDocs.filter((p) => p.difficulty === "Medium")
        .length,
      hard: acceptedProblemDocs.filter((p) => p.difficulty === "Hard").length,
    };

    // Calculate streak using user method
    const streak = user.calculateStreak ? user.calculateStreak() : 0;

    res.json({
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        totalSolved: user.acceptedProblems?.length || 0,
        solvedProblems: user.acceptedProblems || [], // Array of titleSlugs
        lastSynced: user.lastSynced,
        ranking: user.ranking || 0, // Use stored ranking or 0
        streak,
        joinDate: user.createdAt || new Date(),
        difficultyStats,
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get topic-wise analysis (authenticated)
router.get("/report/:username", authenticate, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get problem details for solved problems
    const solvedProblemDocs = await Problem.find({
      titleSlug: { $in: user.acceptedProblems || [] },
    });

    // Define topic mappings
    const topicMappings = {
      array: ["Array", "Two Pointers", "Sliding Window"],
      string: ["String", "String Matching"],
      "linked-list": ["Linked List"],
      tree: ["Tree", "Binary Tree", "Binary Search Tree"],
      graph: ["Graph", "BFS", "DFS", "Union Find"],
      "dynamic-programming": ["Dynamic Programming"],
      sorting: ["Sorting"],
      searching: ["Binary Search"],
      stack: ["Stack", "Monotonic Stack"],
      queue: ["Queue"],
      heap: ["Heap (Priority Queue)"],
      "hash-table": ["Hash Table"],
    };

    // Calculate topic-wise stats
    const topicStats = {};

    for (const [topicId, tags] of Object.entries(topicMappings)) {
      const topicProblems = solvedProblemDocs.filter(
        (problem) =>
          problem.tags &&
          problem.tags.some((tag) =>
            tags.some((topicTag) =>
              tag.toLowerCase().includes(topicTag.toLowerCase()),
            ),
          ),
      );

      // Get all problems for this topic from database
      const allTopicProblems = await Problem.find({
        tags: { $in: tags.map((tag) => new RegExp(tag, "i")) },
      });

      topicStats[topicId] = {
        solved: topicProblems.length,
        total: allTopicProblems.length || 50, // Default to 50 if no problems found
        easy: topicProblems.filter((p) => p.difficulty === "Easy").length,
        medium: topicProblems.filter((p) => p.difficulty === "Medium").length,
        hard: topicProblems.filter((p) => p.difficulty === "Hard").length,
        accuracy:
          allTopicProblems.length > 0
            ? Math.round((topicProblems.length / allTopicProblems.length) * 100)
            : 0,
      };
    }

    // Calculate streak
    const streak = user.calculateStreak ? user.calculateStreak() : 0;

    res.json({
      username,
      topicStats,
      overallStats: {
        totalSolved: solvedProblemDocs.length,
        easyCount: solvedProblemDocs.filter((p) => p.difficulty === "Easy")
          .length,
        mediumCount: solvedProblemDocs.filter((p) => p.difficulty === "Medium")
          .length,
        hardCount: solvedProblemDocs.filter((p) => p.difficulty === "Hard")
          .length,
        accuracy:
          solvedProblemDocs.length > 0
            ? Math.round(
                (solvedProblemDocs.length / (await Problem.countDocuments())) *
                  100,
              )
            : 0, // Accuracy based on total problems in DB
        streak,
      },
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get problems by topic (authenticated)
router.get("/topic/:topic/problems", authenticate, async (req, res) => {
  try {
    const { topic } = req.params;
    const { difficulty, status, search } = req.query;

    // Define topic mappings
    const topicMappings = {
      array: ["Array", "Two Pointers", "Sliding Window"],
      string: ["String", "String Matching"],
      "linked-list": ["Linked List"],
      tree: ["Tree", "Binary Tree", "Binary Search Tree"],
      graph: ["Graph", "BFS", "DFS", "Union Find"],
      "dynamic-programming": ["Dynamic Programming"],
      sorting: ["Sorting"],
      searching: ["Binary Search"],
      stack: ["Stack", "Monotonic Stack"],
      queue: ["Queue"],
      heap: ["Heap (Priority Queue)"],
      "hash-table": ["Hash Table"],
    };

    if (!topicMappings[topic]) {
      return res.status(400).json({ message: "Invalid topic" });
    }

    let query = {
      tags: { $in: topicMappings[topic].map((tag) => new RegExp(tag, "i")) },
    };

    // Apply difficulty filter
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    // Apply search filter (escape user input to prevent ReDoS)
    if (search) {
      const escapedSearch = escapeRegExp(search);
      query.$or = [
        { title: new RegExp(escapedSearch, "i") },
        { titleSlug: new RegExp(escapedSearch, "i") },
        { tags: { $in: [new RegExp(escapedSearch, "i")] } },
      ];
    }

    const problems = await Problem.find(query).sort({ frontendQuestionId: 1 });

    // If user is provided, mark solved problems
    const { username } = req.query;
    let solvedProblems = [];
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        solvedProblems = user.acceptedProblems || [];
      }
    }

    const enhancedProblems = problems.map((problem) => ({
      ...problem.toObject(),
      solved: solvedProblems.includes(problem.titleSlug),
      acceptanceRate: problem.acRate || 0,
      frequency: 0,
      companies: [],
      premium: problem.isPaidOnly || false,
    }));

    res.json({
      topic,
      problems: enhancedProblems,
      stats: {
        total: problems.length,
        solved: enhancedProblems.filter((p) => p.solved).length,
        easy: problems.filter((p) => p.difficulty === "Easy").length,
        medium: problems.filter((p) => p.difficulty === "Medium").length,
        hard: problems.filter((p) => p.difficulty === "Hard").length,
      },
    });
  } catch (error) {
    console.error("Error fetching topic problems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get questions statistics (total count and distribution) (authenticated)
router.get("/questions/stats", authenticate, async (req, res) => {
  try {
    console.log("📊 Fetching questions statistics...");
    const totalCount = await Problem.countDocuments();
    console.log(`Total problems in DB: ${totalCount}`);

    const easyCount = await Problem.countDocuments({ difficulty: "Easy" });
    const mediumCount = await Problem.countDocuments({ difficulty: "Medium" });
    const hardCount = await Problem.countDocuments({ difficulty: "Hard" });

    console.log(
      `Difficulty breakdown - Easy: ${easyCount}, Medium: ${mediumCount}, Hard: ${hardCount}`,
    );

    // Get topic-wise distribution
    const topicMappings = {
      array: ["Array", "Two Pointers", "Sliding Window"],
      string: ["String", "String Matching"],
      "linked-list": ["Linked List"],
      tree: ["Tree", "Binary Tree", "Binary Search Tree"],
      graph: ["Graph", "BFS", "DFS", "Union Find"],
      "dynamic-programming": ["Dynamic Programming"],
      sorting: ["Sorting"],
      searching: ["Binary Search"],
      stack: ["Stack", "Monotonic Stack"],
      queue: ["Queue"],
      heap: ["Heap (Priority Queue)"],
      "hash-table": ["Hash Table"],
    };

    const topicDistribution = {};
    for (const [topicId, tags] of Object.entries(topicMappings)) {
      const topicCount = await Problem.countDocuments({
        tags: { $in: tags.map((tag) => new RegExp(tag, "i")) },
      });
      topicDistribution[topicId] = topicCount;
    }

    res.json({
      total: totalCount,
      distribution: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
      topicDistribution,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error fetching questions stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user progress history (for charts) (authenticated)
router.get("/progress/:username", authenticate, async (req, res) => {
  try {
    const { username } = req.params;

    // Mock progress data - in real app, this would come from submission history
    const progressData = [
      { month: "Jan", solved: 45 },
      { month: "Feb", solved: 67 },
      { month: "Mar", solved: 89 },
      { month: "Apr", solved: 112 },
      { month: "May", solved: 156 },
      { month: "Jun", solved: 189 },
      { month: "Jul", solved: 220 },
      { month: "Aug", solved: 247 },
    ];

    // Mock calendar data - in real app, this would be based on daily submissions
    const calendarData = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        count: Math.random() > 0.7 ? Math.floor(Math.random() * 12) : 0,
      };
    });

    res.json({
      username,
      progressOverTime: progressData,
      calendarData: calendarData.reverse(), // Most recent first
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
