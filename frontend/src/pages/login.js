import { Sparkles, Rocket, Lock, Key, CheckCircle, Zap, Briefcase } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (activeTab === "signup") {
        // Validate passwords match
        if (password !== confirmPassword) {
          setMessage("❌ Passwords do not match. Please try again.");
          setIsLoading(false);
          return;
        }

        const result = await signup(username, email, password);
        if (result.success) {
          setMessage("✅ Signup successful! Redirecting to personalization...");
          setTimeout(() => router.push("/personalize"), 2000);
        } else {
          setMessage(`❌ ${result.error || "Signup failed"}`);
          setIsLoading(false);
        }
      } else {
        // Login
        const result = await login(username, password);
        if (result.success) {
          setMessage("✅ Login successful! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setMessage(`❌ ${result.error || "Login failed"}`);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setMessage(`❌ ${error.message || "An error occurred"}`);
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage("");
    if (tab === "login") {
      setEmail("");
      setConfirmPassword("");
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setMessage("Connecting with Google...");

    setTimeout(() => {
      setMessage(
        "✅ Google login successful! Redirecting to personalization..."
      );
      setTimeout(() => {
        router.push("/personalize");
      }, 2000);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen auth-container relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-16 w-24 h-24 bg-purple-400 dark:bg-purple-600 rounded-full opacity-30 animate-bounce"
          style={{ animationDuration: "3s" }}></div>
        <div
          className="absolute bottom-32 left-20 w-20 h-20 bg-pink-400 dark:bg-pink-600 rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "1s" }}></div>
        <div
          className="absolute bottom-20 right-32 w-16 h-16 bg-yellow-400 dark:bg-yellow-500 rounded-full opacity-35 animate-bounce"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/10 to-purple-100/10 dark:from-transparent dark:via-blue-900/10 dark:to-purple-900/10"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20 theme-transition">
        <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-full p-2 border border-white/30 dark:border-gray-700/50 transition-all duration-500">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 theme-transition">
        {/* Header/Branding with enhanced styling */}
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300 theme-transition stagger-animation">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-500">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 transition-all duration-500">
            LeetGenie
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm leading-relaxed">
            ✨ Personalized coding paths
            <br />
            🚀 Intelligent progress tracking
            <br />
            💼 Built to get you hired
          </p>
        </div>

        {/* Enhanced Login/Signup Form */}
        <div className="w-full max-w-md">
          <div className="auth-card rounded-2xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            {/* Enhanced Success/Error Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm font-medium transform animate-pulse ${
                  message.includes("✅")
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                    : "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                }`}>
                <div className="flex items-center">
                  <div className="mr-2">
                    {message.includes("✅") ? <CheckCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  {message}
                </div>
              </div>
            )}

            {/* Enhanced Tabs */}
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 shadow-inner">
              <button
                onClick={() => handleTabChange("login")}
                className={`tab-button flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "tab-active"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}>
                <Lock className="w-4 h-4 inline-block mr-1" /> Log in
              </button>
              <button
                onClick={() => handleTabChange("signup")}
                className={`tab-button flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "tab-active"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}>
                <Rocket className="w-4 h-4 inline-block mr-1" /> Sign up
              </button>
            </div>

            {/* Enhanced Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="google-button w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center mb-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading && message.includes("Google")
                ? "Connecting..."
                : "Continue with Google"}
            </button>

            {/* Enhanced Separator */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="separator-line w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="separator-text px-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                  OR {activeTab.toUpperCase()} WITH
                </span>
              </div>
            </div>

            {/* Enhanced Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="auth-input w-full px-4 py-3 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
              </div>

              {activeTab === "signup" && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="auth-input w-full px-4 py-3 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="auth-input w-full px-4 py-3 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                />
              </div>

              {activeTab === "signup" && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="auth-input w-full px-4 py-3 rounded-xl text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  />
                </div>
              )}

              {activeTab === "login" && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
                    Forgot Password? <Key className="w-4 h-4 inline-block ml-1" />
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="auth-button w-full py-3 px-4 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <div className="flex items-center justify-center">
                  <span className="mr-2">
                    {activeTab === "login" ? <Rocket className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </span>
                  {isLoading
                    ? "Processing..."
                    : activeTab === "login"
                    ? "Log In & Start Coding"
                    : "Create Account"}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Back to Home Link */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/30">
            <span className="mr-2">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
