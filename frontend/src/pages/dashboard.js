import {
  Sparkles,
  Zap,
  RefreshCw,
  Mic,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle,
  Hand,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [aiInput, setAiInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user profile
      const profileResponse = await api.getUserProfile(user.username);
      const profile = profileResponse.user; // Extract user object from response

      setUserProfile(profile);
      setStreak(profile.streak || 0);

      // Fetch all problems for context
      const allProblems = await api.getAllProblems();

      // Get user's solved problems (titleSlugs)
      const solvedSlugs = profile.solvedProblems || [];

      console.log(`[Dashboard] User has solved ${solvedSlugs.length} problems`);

      // Map solved problems to Problem objects for ML backend
      const solvedProblems = allProblems.filter((p) =>
        solvedSlugs.includes(p.titleSlug)
      );

      console.log(`[Dashboard] Mapped to ${solvedProblems.length} problem objects`);

      // Get user's preferred tag from preferences
      const preferredTag = profile.preferences?.confidentTopics?.[0] || "array";
      const hasPremium = profile.preferences?.hasPremium || false;
      const count = profile.preferences?.recommendationCount || 10;

      // Get ML recommendations (returns titleSlugs and basic info)
      const recs = await api.getRecommendations(
        solvedProblems,
        allProblems,
        preferredTag,
        hasPremium,
        count
      );

      // Enrich recommendations with full problem data (including title)
      const enrichedRecs = recs.map((rec) => {
        const fullProblem = allProblems.find(
          (p) => p.titleSlug === rec.titleSlug
        );
        return fullProblem || rec; // Fallback to ML response if not found
      });

      setRecommendations(enrichedRecs); // Use all returned recommendations
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAiInput(suggestion);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                CodeAscend
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md shadow-sm transition-all hover:shadow-md">
                  Dashboard
                </button>
              </Link>
              <Link href="/past-records">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all">
                  Records
                </button>
              </Link>
              <Link href="/report">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all">
                  Report
                </button>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-700 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1.5" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  {streak} day{streak !== 1 ? "s" : ""}
                </span>
              </div>
              <ThemeToggle />
              <Link href="/profile">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md hover:shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.username || "User"}! <Hand className="inline-block w-6 h-6 ml-1" />
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You're on the{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {userProfile?.preferences?.experienceLevel?.toLowerCase() ||
                    "beginner"}
                </span>{" "}
                path. Ready to level up today?
              </p>
            </div>

            {/* Today's Practice Set */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI-Curated Problems
                  </h3>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {recommendations.length} problems
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {recommendations.length > 0 ? (
                  recommendations.map((problem, index) => (
                    <a
                      key={index}
                      href={`https://leetcode.com/problems/${problem.titleSlug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                            {index + 1}
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {problem.acRate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                              {Math.round(problem.acRate)}% solved
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : problem.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      No recommendations yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Complete your personalization to get started!
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span className="font-medium">Refresh</span>
                </button>
                {recommendations.length > 0 && (
                  <a
                    href={`https://leetcode.com/problems/${recommendations[0].titleSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-md">
                    <span className="font-medium">Start Solving</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ask AI Assistant
                </h3>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="What would you like to practice today?"
                  className="w-full p-4 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <Mic className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Different Binary Trees problem",
                  "Easier Arrays problems",
                  "Harder Dynamic Programming",
                  "Focus on weak areas",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Key Takeaways
                </h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Quick wins on arrays — Two Sum in 7 mins.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Strong pattern spotting in sliding window — Anagram Finder.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Missed edge cases — failed empty input in Merge Intervals.
                  </span>
                </li>
              </ul>
            </div>

            {/* Improvement Plan */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Improvement Plan
                </h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Redo tricky Binary Search problems — Search Rotated Array.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Test 3 edge cases before submit — empty, single, max.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Dry-run logic with simple inputs — Koko Eating Bananas.
                  </span>
                </li>
              </ul>
            </div>

            {/* This Week Plans */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  This Week Plans
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Introduction & Arrays
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Graphs
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Linked Lists
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Stacks & Queues
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hash Maps (Hash Tables)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Trees (Binary Trees & BSTs)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Dynamic Programming
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
