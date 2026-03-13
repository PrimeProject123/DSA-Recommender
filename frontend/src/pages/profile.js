import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Calendar,
  TrendingUp,
  Award,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  CalendarDays,
  BarChart,
  Link2,
  Sparkles,
  Zap,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

// Calendar heatmap component
const CalendarHeatmap = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate calendar grid for the past year
  const generateCalendarData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    const calendar = [];

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const dayData = data.find((item) => item.date === dateStr) || {
        date: dateStr,
        count: 0,
      };
      calendar.push({
        ...dayData,
        day: new Date(d),
        weekday: d.getDay(),
      });
    }

    return calendar;
  };

  const getIntensityColor = (count) => {
    // Check dark mode safely (SSR-compatible)
    const darkMode =
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false;

    if (darkMode) {
      if (count === 0) return "#374151"; // gray-700
      if (count <= 2) return "#065f46"; // emerald-800
      if (count <= 5) return "#047857"; // emerald-700
      if (count <= 10) return "#059669"; // emerald-600
      return "#10b981"; // emerald-500
    } else {
      // Light mode colors (original)
      if (count === 0) return "#ebedf0";
      if (count <= 2) return "#9be9a8";
      if (count <= 5) return "#40c463";
      if (count <= 10) return "#30a14e";
      return "#216e39";
    }
  };

  const calendarData = generateCalendarData();
  const weeks = [];
  let currentWeek = [];

  calendarData.forEach((day, index) => {
    if (day.weekday === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 theme-transition">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
        <CalendarDays className="inline-block w-5 h-5 mr-2" />
        Activity Calendar
      </h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col space-y-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div key={day} className="flex items-center space-x-1">
              <div className="w-6 text-xs text-gray-500 dark:text-gray-400 text-right transition-colors duration-500">
                {i % 2 === 0 ? day : ""}
              </div>
              <div className="flex space-x-1">
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-500 transition-all duration-300"
                    style={{
                      backgroundColor: week[i]
                        ? getIntensityColor(week[i].count)
                        : "#ebedf0",
                      opacity: week[i] ? 1 : 0.3,
                    }}
                    title={
                      week[i]
                        ? `${week[i].count} problems solved on ${week[i].date}`
                        : ""
                    }
                    onMouseEnter={() => week[i] && setSelectedDate(week[i])}
                    onMouseLeave={() => setSelectedDate(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 3, 6, 10].map((count) => (
              <div
                key={count}
                className="w-3 h-3 rounded-sm transition-all duration-500"
                style={{ backgroundColor: getIntensityColor(count) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {selectedDate && (
          <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-500">
            {selectedDate.count} problems on {selectedDate.date}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    dailyTarget: 3,
    preferredDifficulty: "Medium",
    favoriteTopics: ["Array", "String", "Dynamic Programming"],
    notifications: true,
    publicProfile: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [questionsStats, setQuestionsStats] = useState(null);
  const { user: authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
      return;
    }
    fetchProfileData();
  }, [authUser]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel for better performance
      const [profileData, reportData, progressResponse, statsData] =
        await Promise.all([
          api.getUserProfile(authUser.username),
          api.getReport(authUser.username),
          api.getProgress(authUser.username),
          api.getQuestionsStats(),
        ]);

      // Store questions stats for difficulty totals
      setQuestionsStats(statsData);

      // Set user data with real values
      setUser({
        username: authUser.username,
        name: authUser.name || authUser.username,
        email: authUser.email || "",
        totalSolved: profileData.user?.totalSolved || 0,
        ranking: profileData.user?.ranking || 0,
        streak: profileData.user?.streak || 0,
        joinDate: profileData.user?.joinDate || new Date().toISOString(),
        sessionToken: "",
      });

      // Set progress data with real values
      setProgressData({
        easyCount: profileData.user?.difficultyStats?.easy || 0,
        mediumCount: profileData.user?.difficultyStats?.medium || 0,
        hardCount: profileData.user?.difficultyStats?.hard || 0,
        topicStats: reportData.topicStats || {},
        calendar: progressResponse.calendarData || [],
        monthlyStats: progressResponse.progressOverTime || [],
      });

      // Fetch and set preferences
      const prefsData = await api.getPreferences(authUser.username);

      setPreferences({
        dailyTarget: prefsData.dailyTarget || 3,
        preferredDifficulty: prefsData.experienceLevel || "Medium",
        favoriteTopics: prefsData.confidentTopics || ["Array"],
        notifications: prefsData.notifications !== false,
        publicProfile: prefsData.publicProfile || false,
        hasPremium: prefsData.hasPremium || false,
        recommendationCount: prefsData.recommendationCount || 10,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!user.sessionToken) {
      alert("Please enter your LeetCode session token first.");
      return;
    }

    try {
      setLoading(true);

      // Sync LeetCode data with session token
      const result = await api.syncLeetCode(user.username, user.sessionToken);

      // Save session token after successful sync
      await api.saveSessionToken(user.username, user.sessionToken);

      alert(
        `✅ Successfully synced ${result.totalAccepted || 0} accepted problems!`,
      );

      // Refresh profile data
      await fetchProfileData();
    } catch (error) {
      console.error("Sync error:", error);
      alert(`❌ Failed to sync: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Difficulty stats from progress data (use real totals from API)
  const difficultyStats = progressData
    ? [
        {
          name: "Easy",
          solved: progressData.easyCount || 0,
          total: questionsStats?.distribution?.easy || 0,
        },
        {
          name: "Medium",
          solved: progressData.mediumCount || 0,
          total: questionsStats?.distribution?.medium || 0,
        },
        {
          name: "Hard",
          solved: progressData.hardCount || 0,
          total: questionsStats?.distribution?.hard || 0,
        },
      ]
    : [
        {
          name: "Easy",
          solved: 0,
          total: questionsStats?.distribution?.easy || 0,
        },
        {
          name: "Medium",
          solved: 0,
          total: questionsStats?.distribution?.medium || 0,
        },
        {
          name: "Hard",
          solved: 0,
          total: questionsStats?.distribution?.hard || 0,
        },
      ];

  // Calendar data from progress
  const calendarData =
    progressData?.calendar ||
    Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        count: 0,
      };
    });

  // Solved over time from progress
  const solvedOverTime = progressData?.monthlyStats || [
    { month: "Jan", solved: 0 },
    { month: "Feb", solved: 0 },
    { month: "Mar", solved: 0 },
    { month: "Apr", solved: 0 },
    { month: "May", solved: 0 },
    { month: "Jun", solved: 0 },
    { month: "Jul", solved: 0 },
    { month: "Aug", solved: user?.totalSolved || 0 },
  ];

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.savePreferences(user.username, {
        name: user.name,
        email: user.email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile changes");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      await api.savePreferences(user.username, {
        dailyTarget: preferences.dailyTarget,
        preferredDifficulty: preferences.preferredDifficulty,
        favoriteTopics: preferences.favoriteTopics,
        notifications: preferences.notifications,
        publicProfile: preferences.publicProfile,
        hasPremium: preferences.hasPremium,
        recommendationCount: preferences.recommendationCount,
      });
      alert("✅ Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("❌ Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                  {user?.streak || 0} day{user?.streak !== 1 ? "s" : ""}
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
            <User className="inline-block w-6 h-6 mr-2" />
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, track progress, and customize preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 theme-transition stagger-animation">
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: User },
                { id: "progress", name: "Progress", icon: TrendingUp },
                { id: "settings", name: "Settings", icon: Settings },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-300 ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 theme-transition">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition stagger-animation">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors duration-500">
                    {(user.name || user.username || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
                      {user.name || user.username}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      @{user.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                      Member since{" "}
                      {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300">
                  {isEditing ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit3 className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="auth-input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="auth-input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={handleSaveProfile}
                      className="auth-button inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-all duration-300">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-animation">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-500">
                      {user.totalSolved}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      Problems Solved
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-500">
                      {user.ranking.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      Global Ranking
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-500">
                      {user.streak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      Current Streak
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-500">
                      {Math.round((user.totalSolved / 365) * 100) / 100}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      Daily Average
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-animation">
              {difficultyStats.map((stat, index) => (
                <div
                  key={stat.name}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-500">
                      {stat.name} Problems
                    </h3>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
                      {stat.solved}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 transition-colors duration-500">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        stat.name === "Easy"
                          ? "bg-green-500 dark:bg-green-400"
                          : stat.name === "Medium"
                            ? "bg-yellow-500 dark:bg-yellow-400"
                            : "bg-red-500 dark:bg-red-400"
                      }`}
                      style={{
                        width: `${(stat.solved / stat.total) * 100}%`,
                      }}></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    {stat.solved} of {stat.total} solved
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="space-y-8 theme-transition">
            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition stagger-animation">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                <BarChart className="inline-block w-5 h-5 mr-2" />
                Problems Solved Over Time
              </h3>
              <div className="h-80 flex items-end justify-between space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-500">
                {solvedOverTime.map((item, index) => (
                  <div
                    key={item.month}
                    className="flex flex-col items-center flex-1 stagger-animation"
                    style={{ animationDelay: `${index * 0.1}s` }}>
                    <div
                      className="bg-blue-500 dark:bg-blue-600 rounded-t w-full transition-all duration-500 hover:bg-blue-600 dark:hover:bg-blue-500 hover:scale-105"
                      style={{
                        height: `${
                          (item.solved /
                            Math.max(...solvedOverTime.map((d) => d.solved))) *
                          280
                        }px`,
                        minHeight: "20px",
                      }}
                      title={`${item.month}: ${item.solved} problems`}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-500">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Heatmap */}
            <CalendarHeatmap data={calendarData} />

            {/* Monthly Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition stagger-animation">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                <BarChart className="inline-block w-5 h-5 mr-2" />
                Monthly Breakdown
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-500">
                {solvedOverTime.map((item, index) => (
                  <div
                    key={item.month}
                    className="flex flex-col items-center flex-1 stagger-animation"
                    style={{ animationDelay: `${index * 0.1}s` }}>
                    <div
                      className="bg-green-500 dark:bg-green-600 rounded-t w-full transition-all duration-500 hover:bg-green-600 dark:hover:bg-green-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 dark:hover:shadow-green-600/30"
                      style={{
                        height: `${
                          (item.solved /
                            Math.max(...solvedOverTime.map((d) => d.solved))) *
                          200
                        }px`,
                        minHeight: "20px",
                      }}
                      title={`${item.month}: ${item.solved} problems`}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-500">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8 theme-transition">
            {/* LeetCode Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition stagger-animation">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                <Link2 className="inline-block w-5 h-5 mr-2" />
                LeetCode Integration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
                    LeetCode Session Token
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={user.sessionToken}
                      onChange={(e) =>
                        setUser({ ...user, sessionToken: e.target.value })
                      }
                      placeholder="Enter your LeetCode session token..."
                      className="auth-input w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400">
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
                    This token is used to sync your LeetCode progress. You can
                    find it in your browser cookies.
                  </p>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={loading || !user.sessionToken}
                  className="auth-button inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Syncing..." : "Test Connection & Sync Problems"}
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 theme-transition stagger-animation">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                ⚙️ Preferences
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
                    Daily Target
                  </label>
                  <select
                    value={preferences.dailyTarget}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        dailyTarget: parseInt(e.target.value),
                      })
                    }
                    className="auth-input border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <option value={1}>1 problem per day</option>
                    <option value={2}>2 problems per day</option>
                    <option value={3}>3 problems per day</option>
                    <option value={5}>5 problems per day</option>
                    <option value={10}>10 problems per day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
                    Preferred Difficulty
                  </label>
                  <select
                    value={preferences.preferredDifficulty}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        preferredDifficulty: e.target.value,
                      })
                    }
                    className="auth-input border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
                    Number of Recommendations
                  </label>
                  <select
                    value={preferences.recommendationCount || 10}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        recommendationCount: parseInt(e.target.value),
                      })
                    }
                    className="auth-input border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <option value={5}>5 recommendations</option>
                    <option value={10}>10 recommendations</option>
                    <option value={15}>15 recommendations</option>
                    <option value={20}>20 recommendations</option>
                    <option value={25}>25 recommendations</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 shadow-sm focus:border-blue-300 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50 bg-white dark:bg-gray-700 transition-colors duration-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-500 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      Enable daily reminder notifications
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.publicProfile}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          publicProfile: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 shadow-sm focus:border-blue-300 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50 bg-white dark:bg-gray-700 transition-colors duration-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-500 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      Make profile public
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.hasPremium || false}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          hasPremium: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 shadow-sm focus:border-blue-300 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:ring-opacity-50 bg-white dark:bg-gray-700 transition-colors duration-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-500 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      I have LeetCode Premium (show premium problems)
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="auth-button inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition-all duration-300 hover:scale-105">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
