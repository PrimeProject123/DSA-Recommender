// API utility functions
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const ML_BASE_URL = process.env.NEXT_PUBLIC_ML_URL || "http://localhost:8000";

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Login failed");
    }
    return res.json();
  },

  async signup(username, email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Signup failed");
    }
    return res.json();
  },

  // User Profile
  async getUserProfile(username) {
    const res = await fetch(`${API_BASE_URL}/api/profile/${username}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  // Report/Analytics
  async getReport(username) {
    const res = await fetch(`${API_BASE_URL}/api/report/${username}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch report");
    return res.json();
  },

  // Questions Statistics
  async getQuestionsStats() {
    const res = await fetch(`${API_BASE_URL}/api/questions/stats`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch questions stats");
    return res.json();
  },

  // Progress
  async getProgress(username) {
    const res = await fetch(`${API_BASE_URL}/api/progress/${username}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch progress");
    return res.json();
  },

  // Topic Problems
  async getTopicProblems(topic, filters = {}) {
    // Remove undefined/null values from filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== ""),
    );
    const queryParams = new URLSearchParams(cleanFilters);
    const res = await fetch(
      `${API_BASE_URL}/api/topic/${topic}/problems?${queryParams}`,
      { credentials: "include" },
    );
    if (!res.ok) throw new Error("Failed to fetch problems");
    const data = await res.json();
    return data.problems || [];
  },

  // All Problems
  async getAllProblems() {
    const res = await fetch(`${API_BASE_URL}/api/all`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch all problems");
    return res.json();
  },

  // Preferences
  async savePreferences(username, preferences) {
    const res = await fetch(`${API_BASE_URL}/api/preferences/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(preferences),
    });
    if (!res.ok) throw new Error("Failed to save preferences");
    return res.json();
  },

  async getPreferences(username) {
    const res = await fetch(`${API_BASE_URL}/api/preferences/${username}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch preferences");
    return res.json();
  },

  // ML Recommendations
  async getRecommendations(
    done,
    all,
    preferredTag = null,
    hasPremium = false,
    count = 10,
  ) {
    // Transform data to match ML backend expectations
    const transformProblem = (p) => ({
      titleSlug: p.titleSlug,
      difficulty: p.difficulty,
      acRate: p.acRate || 0,
      frontendQuestionId: parseInt(p.frontendQuestionId) || 0,
      topicTags: p.tags || p.topicTags || [],
      isPaidOnly: p.isPaidOnly || false,
    });

    const res = await fetch(`${ML_BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        done: (done || []).map(transformProblem),
        all: (all || []).map(transformProblem),
        preferredTag,
        hasPremium,
        count,
      }),
    });
    if (!res.ok) throw new Error("Failed to get recommendations");
    const data = await res.json();
    return data.suggestions || [];
  },

  // LeetCode Sync
  async saveSessionToken(username, sessionToken) {
    const res = await fetch(`${API_BASE_URL}/api/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, sessionToken }),
    });
    if (!res.ok) throw new Error("Failed to save session token");
    return res.json();
  },

  async syncLeetCode(username, sessionToken) {
    const res = await fetch(
      `${API_BASE_URL}/api/acceptedQuestion/${username}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionToken }),
      },
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to sync LeetCode data");
    }
    const data = await res.json();
    return { totalAccepted: data.length, problems: data };
  },
};

export default api;
