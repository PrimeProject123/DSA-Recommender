import { Sparkles, Zap, BookOpen, Target, Calendar, Tag, FileText, RefreshCw, BarChart3, Type, Link2, TreeDeciduous, Network, ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

export default function PastRecords() {
  const [activeTab, setActiveTab] = useState("past-records");
  const [activeTopicFilter, setActiveTopicFilter] = useState("All");
  const { user } = useAuth();

  // Topic filters for practice sets
  const topicFilters = [
    "All",
    "Array",
    "String",
    "Linked List",
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Sorting",
    "Searching",
  ];

  const practiceSets = [
    {
      id: 230,
      date: "11-03-25",
      timeTaken: "1hrs 20mins",
      image: "digital-circuit",
      topics: ["Array", "Dynamic Programming"],
      tryAgainLink: "https://www.google.com/",
      feedbackLink: "/feedback?setId=230",
    },
    {
      id: 231,
      date: "12-03-25",
      timeTaken: "40mins",
      image: "highway-interchange",
      topics: ["String", "Array"],
      tryAgainLink: "/practice-set-231",
      feedbackLink: "/feedback?setId=231",
    },
    {
      id: 232,
      date: "14-03-25",
      timeTaken: "1hrs 02mins",
      image: "highway-dusk",
      topics: ["Tree", "Graph"],
      tryAgainLink: "/practice-set-232",
      feedbackLink: "/feedback?setId=232",
    },
    {
      id: 233,
      date: "15-03-25",
      timeTaken: "1hrs 56mins",
      image: "highway-night",
      topics: ["Dynamic Programming", "Sorting"],
      tryAgainLink: "/practice-set-233",
      feedbackLink: "/feedback?setId=233",
    },
    {
      id: 234,
      date: "16-03-25",
      timeTaken: "52mins",
      image: "city-night",
      topics: ["Linked List", "Searching"],
      tryAgainLink: "/practice-set-234",
      feedbackLink: "/feedback?setId=234",
    },
    {
      id: 235,
      date: "17-03-25",
      timeTaken: "1hrs 32mins",
      image: "castle",
      topics: ["Graph", "Tree"],
      tryAgainLink: "/practice-set-235",
      feedbackLink: "/feedback?setId=235",
    },
  ];

  const getImageStyle = (imageType) => {
    const styles = {
      "digital-circuit":
        "bg-gradient-to-br from-green-500 via-green-600 to-green-800 dark:from-green-600 dark:via-green-700 dark:to-green-900",
      "highway-interchange":
        "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 dark:from-teal-500 dark:via-cyan-600 dark:to-blue-700",
      "highway-dusk":
        "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-orange-500 dark:via-pink-600 dark:to-purple-700",
      "highway-night":
        "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 dark:from-purple-600 dark:via-pink-600 dark:to-rose-600",
      "city-night":
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800",
      castle:
        "bg-gradient-to-br from-slate-600 via-gray-700 to-gray-800 dark:from-slate-700 dark:via-gray-800 dark:to-gray-900",
    };
    return (
      styles[imageType] ||
      "bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800"
    );
  };

  // Filter practice sets based on selected topic
  const filteredPracticeSets =
    activeTopicFilter === "All"
      ? practiceSets
      : practiceSets.filter((set) => set.topics.includes(activeTopicFilter));

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
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md shadow-sm transition-all hover:shadow-md">
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
                  2 days
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
        {/* Page Title */}
        <div className="mb-8 theme-transition stagger-animation">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
            <BookOpen className="inline-block w-6 h-6 mr-2" />Past Practice Records
          </h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Review your completed practice sets and track your progress
          </p>
        </div>

        {/* Topic Filter Tabs */}
        <div className="mb-8 theme-transition stagger-animation">
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <nav className="-mb-px flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
              {topicFilters.map((topic, index) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopicFilter(topic)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap stagger-animation hover:scale-105 transform ${
                    activeTopicFilter === topic
                      ? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="flex items-center">
                    {topic === "All" && <Target className="w-4 h-4" />}
                    {topic === "Array" && <BarChart3 className="w-4 h-4" />}
                    {topic === "String" && <Type className="w-4 h-4" />}
                    {topic === "Linked List" && <Link2 className="w-4 h-4" />}
                    {topic === "Tree" && <TreeDeciduous className="w-4 h-4" />}
                    {topic === "Graph" && <Network className="w-4 h-4" />}
                    {topic === "Dynamic Programming" && <Zap className="w-4 h-4" />}
                    {topic === "Sorting" && <ArrowUpDown className="w-4 h-4" />}
                    {topic === "Searching" && <Search className="w-4 h-4" />}
                    <span className="ml-1">{topic}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Practice Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPracticeSets.map((set, index) => (
            <div
              key={set.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-500 theme-transition stagger-animation hover:scale-105 transform border border-gray-100 dark:border-gray-700 group hover:border-blue-200 dark:hover:border-blue-600"
              style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Enhanced Image Container */}
              <div
                className={`h-32 ${getImageStyle(
                  set.image
                )} flex items-center justify-center relative overflow-hidden group transition-all duration-500`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20 dark:opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.3)_0%,_transparent_50%)] group-hover:bg-[radial-gradient(circle_at_40%_60%,_rgba(255,255,255,0.4)_0%,_transparent_50%)] transition-all duration-700"></div>
                </div>

                {/* Practice Set ID with enhanced styling */}
                <div className="relative z-10 text-center">
                  <div className="text-white text-2xl font-bold drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 group-hover:scale-110 transform">
                    #{set.id}
                  </div>
                  <div className="text-white/80 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Practice Set
                  </div>
                </div>

                {/* Enhanced overlay effects */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/30 transition-all duration-300"></div>

                {/* Animated border effect */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-t-lg transition-all duration-300"></div>

                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-500">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500 flex items-center">
                  <span className="text-blue-500 dark:text-blue-400 mr-2">
                    <Target className="w-5 h-5" />
                  </span>
                  Practice Set #{set.id}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-500">
                  <div className="flex items-center">
                    <span className="text-green-500 dark:text-green-400 mr-2">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <span>
                      Date:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {set.date}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-500 dark:text-orange-400 mr-2">
                      ⏱️
                    </span>
                    <span>
                      Time:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {set.timeTaken}
                      </span>
                    </span>
                  </div>

                  {/* Topic Tags */}
                  <div className="flex items-start">
                    <span className="text-purple-500 dark:text-purple-400 mr-2 mt-1">
                      <Tag className="w-4 h-4" />
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {set.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 transition-colors duration-500 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer"
                          onClick={() => setActiveTopicFilter(topic)}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex space-x-3">
                  <Link href={set.feedbackLink} className="flex-1">
                    <button className="w-full px-3 py-2.5 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-sm font-medium hover:scale-105 transform hover:shadow-md dark:hover:shadow-blue-500/20 group">
                      <span className="flex items-center justify-center">
                        <FileText className="w-4 h-4" />{" "}
                        <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
                          View Feedback
                        </span>
                      </span>
                    </button>
                  </Link>
                  <a
                    href={set.tryAgainLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1">
                    <button className="w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-400 dark:hover:to-blue-500 transition-all duration-300 text-sm font-medium hover:scale-105 transform hover:shadow-lg dark:hover:shadow-blue-500/30 group">
                      <span className="flex items-center justify-center">
                        <span className="group-hover:rotate-12 transition-transform duration-300">
                          <RefreshCw className="w-4 h-4" />
                        </span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
                          Try Again
                        </span>
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
