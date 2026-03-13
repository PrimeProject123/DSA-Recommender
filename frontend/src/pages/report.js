import { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  BookOpen,
  Brain,
  Code,
  Database,
  BarChart3,
  Type,
  Link2,
  TreeDeciduous,
  Network,
  Zap,
  ArrowUpDown,
  Search,
  Layers,
  Users,
  Mountain,
  Hash,
  BarChart,
  Lightbulb,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { useRouter } from "next/router";

const ICON_MAP = {
  BarChart3: BarChart3,
  Type: Type,
  Link2: Link2,
  TreeDeciduous: TreeDeciduous,
  Network: Network,
  Zap: Zap,
  ArrowUpDown: ArrowUpDown,
  Search: Search,
  Layers: Layers,
  Users: Users,
  Mountain: Mountain,
  Hash: Hash,
};

const DSA_TOPICS = [
  { id: "array", name: "Arrays", icon: "BarChart3", color: "#3B82F6" },
  { id: "string", name: "Strings", icon: "Type", color: "#10B981" },
  { id: "linked-list", name: "Linked Lists", icon: "Link2", color: "#F59E0B" },
  { id: "tree", name: "Trees", icon: "TreeDeciduous", color: "#8B5CF6" },
  { id: "graph", name: "Graphs", icon: "Network", color: "#EF4444" },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "Zap",
    color: "#06B6D4",
  },
  { id: "sorting", name: "Sorting", icon: "ArrowUpDown", color: "#F97316" },
  { id: "searching", name: "Searching", icon: "Search", color: "#84CC16" },
  { id: "stack", name: "Stack", icon: "Layers", color: "#EC4899" },
  { id: "queue", name: "Queue", icon: "Users", color: "#6366F1" },
  { id: "heap", name: "Heap", icon: "Mountain", color: "#14B8A6" },
  { id: "hash-table", name: "Hash Tables", icon: "Hash", color: "#F43F5E" },
];

const DIFFICULTY_COLORS = {
  Easy: "#22C55E",
  Medium: "#F59E0B",
  Hard: "#EF4444",
};

export default function Report() {
  const [topicStats, setTopicStats] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalSolved: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    accuracy: 0,
    streak: 0,
  });
  const [questionsStats, setQuestionsStats] = useState({
    total: 0,
    distribution: { easy: 0, medium: 0, hard: 0 },
    topicDistribution: {},
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchAllReportData();
  }, [user]);

  // Fetch stats first, then report data that depends on stats
  const fetchAllReportData = async () => {
    try {
      setLoading(true);
      // Fetch questions stats first
      let stats = questionsStats;
      try {
        stats = await api.getQuestionsStats();
        setQuestionsStats(stats);
      } catch (error) {
        console.error("Error fetching questions stats:", error);
      }
      // Now fetch report data with stats available
      await fetchReportData(stats);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async (currentStats) => {
    try {
      // Fetch real report data from backend
      const reportData = await api.getReport(user.username);

      // Use the passed-in stats to avoid race condition
      const statsToUse = currentStats || questionsStats;

      // Transform backend data to match UI structure
      // reportData.topicStats is an object like { "array": {...}, "string": {...} }
      const topicStatsData = DSA_TOPICS.map((topic) => {
        const topicData = reportData.topicStats?.[topic.id] ||
          reportData.topicStats?.[topic.id.toLowerCase()] || {
            solved: 0,
            total: 0,
            accuracy: 0,
            easy: 0,
            medium: 0,
            hard: 0,
          };

        // Use real total from questions stats if available
        const realTotal =
          statsToUse?.topicDistribution?.[topic.id] || topicData.total || 50;

        return {
          ...topic,
          solved: topicData.solved || 0,
          total: realTotal,
          accuracy:
            realTotal > 0
              ? Math.round((topicData.solved / realTotal) * 100)
              : 0,
          rating: getRating(
            realTotal > 0
              ? Math.round((topicData.solved / realTotal) * 100)
              : 0,
          ),
          easy: topicData.easy || 0,
          medium: topicData.medium || 0,
          hard: topicData.hard || 0,
        };
      });

      setTopicStats(topicStatsData);

      // Extract overall stats from API response
      const overallData = reportData.overallStats || reportData;
      setOverallStats({
        totalSolved: overallData.totalSolved || 0,
        easyCount: overallData.easyCount || 0,
        mediumCount: overallData.mediumCount || 0,
        hardCount: overallData.hardCount || 0,
        accuracy: overallData.accuracy || 0,
        streak: overallData.streak || 0,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      // Set default values on error (all zeros, not fake data)
      setTopicStats(
        DSA_TOPICS.map((topic) => ({
          ...topic,
          solved: 0,
          total: 0,
          accuracy: 0,
          rating: getRating(0),
          easy: 0,
          medium: 0,
          hard: 0,
        })),
      );
    }
  };

  const getRating = (accuracy) => {
    if (accuracy >= 90) return { level: "Expert", color: "#7C3AED", stars: 5 };
    if (accuracy >= 80)
      return { level: "Advanced", color: "#2563EB", stars: 4 };
    if (accuracy >= 70)
      return { level: "Intermediate", color: "#059669", stars: 3 };
    if (accuracy >= 60)
      return { level: "Beginner", color: "#D97706", stars: 2 };
    return { level: "Learning", color: "#DC2626", stars: 1 };
  };

  const difficultyData = [
    {
      name: "Easy",
      value: overallStats.easyCount,
      color: DIFFICULTY_COLORS.Easy,
    },
    {
      name: "Medium",
      value: overallStats.mediumCount,
      color: DIFFICULTY_COLORS.Medium,
    },
    {
      name: "Hard",
      value: overallStats.hardCount,
      color: DIFFICULTY_COLORS.Hard,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header with Navigation */}
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
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all">
                  Dashboard
                </button>
              </Link>
              <Link href="/past-records">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all">
                  Records
                </button>
              </Link>
              <Link href="/report">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md shadow-sm transition-all hover:shadow-md">
                  Report
                </button>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-700 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1.5" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  {overallStats.streak} day
                  {overallStats.streak !== 1 ? "s" : ""}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <BarChart className="inline-block w-6 h-6 mr-2" />
            Progress Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your DSA learning journey and identify areas for improvement
          </p>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallStats.totalSolved}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{questionsStats.total}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Solved
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${
                    questionsStats.total > 0
                      ? (overallStats.totalSolved / questionsStats.total) * 100
                      : 0
                  }%`,
                }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <Award className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {overallStats.easyCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{questionsStats.distribution.easy}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Easy Problems
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 bg-green-500 rounded-full transition-all"
                style={{
                  width: `${
                    questionsStats.distribution.easy > 0
                      ? (overallStats.easyCount /
                          questionsStats.distribution.easy) *
                        100
                      : 0
                  }%`,
                }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <div className="text-right">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {overallStats.mediumCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{questionsStats.distribution.medium}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Medium Problems
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 bg-yellow-500 rounded-full transition-all"
                style={{
                  width: `${
                    questionsStats.distribution.medium > 0
                      ? (overallStats.mediumCount /
                          questionsStats.distribution.medium) *
                        100
                      : 0
                  }%`,
                }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <Award className="h-8 w-8 text-red-500" />
              <div className="text-right">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {overallStats.hardCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{questionsStats.distribution.hard}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Hard Problems
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 bg-red-500 rounded-full transition-all"
                style={{
                  width: `${
                    questionsStats.distribution.hard > 0
                      ? (overallStats.hardCount /
                          questionsStats.distribution.hard) *
                        100
                      : 0
                  }%`,
                }}></div>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Difficulty Breakdown
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {difficultyData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic-wise Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <BookOpen className="inline-block w-6 h-6 mr-2" />
              Topic-wise Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click on any topic to practice problems
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topicStats.map((topic) => (
                <Link key={topic.id} href={`/topic/${topic.id}`}>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComponent = ICON_MAP[topic.icon];
                          return IconComponent ? (
                            <IconComponent
                              className="w-6 h-6"
                              style={{ color: topic.color }}
                            />
                          ) : null;
                        })()}
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {topic.name}
                        </h3>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {topic.solved}/{topic.total}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(topic.solved / topic.total) * 100}%`,
                            backgroundColor: topic.color,
                          }}></div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < topic.rating.stars
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}>
                              <Star className="w-4 h-4" />
                            </span>
                          ))}
                        </div>
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: topic.rating.color }}>
                          {topic.rating.level}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span className="text-green-600 dark:text-green-400">
                          Easy: {topic.easy}
                        </span>
                        <span className="text-orange-600 dark:text-orange-400">
                          Medium: {topic.medium}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          Hard: {topic.hard}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <Lightbulb className="inline-block w-6 h-6 mr-2" />
              Recommendations
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Focus Areas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dynamic Programming and Graphs need more attention
                </p>
              </div>

              <div className="text-center">
                <Code className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Next Challenge
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Try more Medium-level Tree problems
                </p>
              </div>

              <div className="text-center">
                <BookOpen className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Strength
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You excel at Array and String problems!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
