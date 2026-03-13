import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ChevronLeft,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  Type,
  Link2,
  TreeDeciduous,
  Network,
  Zap,
  ArrowUpDown,
  Layers,
  Mountain,
  Hash,
  Crown,
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700/50",
  Medium:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50",
  Hard: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700/50",
};

const ICON_MAP = {
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
};

const TOPIC_INFO = {
  array: {
    name: "Arrays",
    icon: "BarChart3",
    description:
      "Linear data structures that store elements in contiguous memory",
  },
  string: {
    name: "Strings",
    icon: "Type",
    description: "Sequence of characters and text manipulation problems",
  },
  "linked-list": {
    name: "Linked Lists",
    icon: "Link2",
    description: "Dynamic data structures with nodes connected via pointers",
  },
  tree: {
    name: "Trees",
    icon: "TreeDeciduous",
    description: "Hierarchical data structures with parent-child relationships",
  },
  graph: {
    name: "Graphs",
    icon: "Network",
    description: "Networks of nodes connected by edges",
  },
  "dynamic-programming": {
    name: "Dynamic Programming",
    icon: "Zap",
    description: "Optimization technique using memoization and tabulation",
  },
  sorting: {
    name: "Sorting",
    icon: "ArrowUpDown",
    description: "Algorithms to arrange data in a particular order",
  },
  searching: {
    name: "Searching",
    icon: "Search",
    description: "Algorithms to find specific elements in data structures",
  },
  stack: {
    name: "Stack",
    icon: "Layers",
    description: "LIFO (Last In First Out) data structure",
  },
  queue: {
    name: "Queue",
    icon: "Users",
    description: "FIFO (First In First Out) data structure",
  },
  heap: {
    name: "Heap",
    icon: "Mountain",
    description: "Complete binary tree with heap property",
  },
  "hash-table": {
    name: "Hash Tables",
    icon: "Hash",
    description: "Key-value pairs with fast access via hash functions",
  },
};

export default function TopicProblems() {
  const router = useRouter();
  const { topic } = router.query;

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: "All",
    status: "All",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (topic) {
      fetchTopicProblems();
    }
  }, [topic, user]);

  useEffect(() => {
    applyFilters();
  }, [problems, filters]);

  const fetchTopicProblems = async () => {
    try {
      setLoading(true);

      // Get user profile to check solved problems
      const profileResponse = await api.getUserProfile(user.username);
      const solvedIds = profileResponse.user?.solvedProblems || [];
      setSolvedProblemIds(solvedIds);

      // Fetch problems for this topic
      const filterParams = {
        username: user.username,
      };

      // Only add filters if they're not "All"
      if (filters.difficulty !== "All") {
        filterParams.difficulty = filters.difficulty;
      }
      if (filters.status !== "All") {
        filterParams.status = filters.status;
      }
      if (filters.search) {
        filterParams.search = filters.search;
      }

      const topicProblems = await api.getTopicProblems(topic, filterParams);

      // Map problems to include solved status
      const problemsWithStatus = topicProblems.map((p) => ({
        ...p,
        solved: solvedIds.includes(p.titleSlug),
        premium: p.premium || p.isPaidOnly || false,
        companies: p.companies || [],
      }));

      // Calculate stats
      const solved = problemsWithStatus.filter((p) => p.solved).length;
      const easy = problemsWithStatus.filter(
        (p) => p.difficulty === "Easy",
      ).length;
      const medium = problemsWithStatus.filter(
        (p) => p.difficulty === "Medium",
      ).length;
      const hard = problemsWithStatus.filter(
        (p) => p.difficulty === "Hard",
      ).length;

      setProblems(problemsWithStatus);
      setStats({
        total: problemsWithStatus.length,
        solved,
        easy,
        medium,
        hard,
      });
    } catch (error) {
      console.error("Error fetching topic problems:", error);
      // Set empty state on error
      setProblems([]);
      setStats({ total: 0, solved: 0, easy: 0, medium: 0, hard: 0 });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    if (filters.difficulty !== "All") {
      filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
    }

    if (filters.status !== "All") {
      if (filters.status === "Solved") {
        filtered = filtered.filter((p) => p.solved);
      } else if (filters.status === "Unsolved") {
        filtered = filtered.filter((p) => !p.solved);
      }
    }

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.tags.some((tag) =>
            tag.toLowerCase().includes(filters.search.toLowerCase()),
          ),
      );
    }

    setFilteredProblems(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!topic || !TOPIC_INFO[topic]) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center theme-transition">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
            Topic Not Found
          </h2>
          <Link
            href="/report"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
            ← Back to Report
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center theme-transition">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 transition-colors duration-500"></div>
      </div>
    );
  }

  const topicInfo = TOPIC_INFO[topic];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-transition">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/report"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 transition-colors duration-300">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Report
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            {(() => {
              const IconComponent = ICON_MAP[topicInfo.icon];
              return IconComponent ? (
                <IconComponent className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              ) : null;
            })()}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
                {topicInfo.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">
                {topicInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-4 text-center transition-all duration-500 hover:shadow-lg dark:hover:shadow-gray-900/30">
            <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Total Problems
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-4 text-center transition-all duration-500 hover:shadow-lg dark:hover:shadow-gray-900/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-500">
              {stats.solved}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Solved
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-4 text-center transition-all duration-500 hover:shadow-lg dark:hover:shadow-gray-900/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-500">
              {stats.easy}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Easy
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-4 text-center transition-all duration-500 hover:shadow-lg dark:hover:shadow-gray-900/30">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-500">
              {stats.medium}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Medium
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-4 text-center transition-all duration-500 hover:shadow-lg dark:hover:shadow-gray-900/30">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 transition-colors duration-500">
              {stats.hard}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Hard
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 p-6 mb-6 transition-colors duration-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-500" />
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-500">
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-500">
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
              </select>
            </div>

            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
              />
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 transition-colors duration-500">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-500">
              Problems ({filteredProblems.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                          problem.solved
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}></div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate transition-colors duration-500">
                        {problem.title}
                        {problem.premium && (
                          <Crown className="ml-2 w-4 h-4 text-orange-500 dark:text-orange-400 inline-block transition-colors duration-500" />
                        )}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border transition-colors duration-500 ${
                          DIFFICULTY_COLORS[problem.difficulty]
                        }`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {problem.acceptanceRate}%
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {problem.frequency}
                      </span>
                      {problem.companies.length > 0 && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {problem.companies.slice(0, 2).join(", ")}
                          {problem.companies.length > 2 &&
                            ` +${problem.companies.length - 2}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      {problem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700/50 transition-colors duration-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <a
                      href={`https://leetcode.com/problems/${problem.titleSlug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 hover:scale-105 transform">
                      Solve
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400 transition-colors duration-500">
                No problems found matching your filters
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
