"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setIsAnimating(true);

    // Show transition overlay
    const overlay = document.getElementById("theme-transition-overlay");
    if (overlay) {
      overlay.classList.add("active");
    }

    // Add theme-transitioning class for special icon effects
    document.documentElement.classList.add("theme-transitioning");

    // Add a subtle page flash effect
    document.documentElement.style.setProperty("--theme-flash", "1");

    // Create enhanced ripple effect
    const button = document.activeElement;
    if (button) {
      button.style.transform = "scale(0.9)";
      button.style.boxShadow = `0 0 30px ${
        currentTheme === "dark"
          ? "rgba(251,191,36,0.6)"
          : "rgba(59,130,246,0.6)"
      }`;
      setTimeout(() => {
        button.style.transform = "scale(1)";
        button.style.boxShadow = "";
      }, 200);
    }

    // Add staggered animation to existing elements
    const animatedElements = document.querySelectorAll(".theme-transition");
    animatedElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.05}s`;
    });

    setTimeout(() => {
      setTheme(currentTheme === "dark" ? "light" : "dark");

      // Remove effects after theme change
      setTimeout(() => {
        if (overlay) {
          overlay.classList.remove("active");
        }
        document.documentElement.style.removeProperty("--theme-flash");
        document.documentElement.classList.remove("theme-transitioning");
        setIsAnimating(false);
      }, 400);
    }, 300);
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`relative p-3 rounded-xl transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 backdrop-blur-sm ${className}`}>
        <div className="h-5 w-5" />
      </div>
    );
  }

  return (
    <button
      onClick={handleThemeToggle}
      disabled={isAnimating}
      className={`
        relative overflow-hidden p-3 rounded-xl group
        transition-all duration-300 ease-out
        hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
        dark:hover:from-gray-800/80 dark:hover:to-gray-700/80
        hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20
        active:scale-95 disabled:opacity-70
        backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50
        ${className}
      `}
      title={
        currentTheme === "dark"
          ? "Switch to Light Mode ☀️"
          : "Switch to Dark Mode 🌙"
      }
      aria-label="Toggle Theme">
      {/* Enhanced Animated Background Gradient */}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-500 ${
          currentTheme === "dark"
            ? "bg-gradient-to-r from-yellow-400/10 via-orange-400/15 to-red-400/10"
            : "bg-gradient-to-r from-blue-600/10 via-purple-600/15 to-indigo-600/10"
        } ${
          isAnimating
            ? "opacity-100 animate-pulse"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* Orbital Ring Animation */}
      <div
        className={`absolute inset-0 rounded-xl border-2 transition-all duration-700 ${
          currentTheme === "dark"
            ? "border-yellow-400/20 group-hover:border-yellow-400/40"
            : "border-blue-400/20 group-hover:border-blue-400/40"
        } ${
          isAnimating
            ? "animate-spin border-opacity-60"
            : "group-hover:animate-orbital"
        }`}
      />

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            currentTheme === "dark" ? "bg-yellow-400/20" : "bg-blue-400/20"
          } ${
            isAnimating
              ? "scale-150 opacity-30"
              : "scale-0 group-active:scale-100 opacity-20"
          }`}
        />
      </div>

      {/* Icon Container with Advanced Animations */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sun Rays Animation */}
          {currentTheme === "dark" && (
            <>
              <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-yellow-400/60 transform -translate-x-1/2 -translate-y-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-yellow-400/60 transform -translate-x-1/2 translate-y-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-yellow-400/60 transform -translate-y-1/2 -translate-x-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-yellow-400/60 transform -translate-y-1/2 translate-x-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Diagonal Rays */}
              <div className="absolute top-1 right-1 w-1.5 h-0.5 bg-yellow-400/40 transform rotate-45 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-1 left-1 w-1.5 h-0.5 bg-yellow-400/40 transform rotate-45 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-1 left-1 w-1.5 h-0.5 bg-yellow-400/40 transform -rotate-45 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-1 right-1 w-1.5 h-0.5 bg-yellow-400/40 transform -rotate-45 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </>
          )}

          {/* Moon Stars */}
          {currentTheme === "light" && (
            <>
              <div
                className="absolute top-1 right-2 w-1 h-1 bg-blue-400/60 rounded-full animate-twinkle opacity-0 group-hover:opacity-100"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-twinkle opacity-0 group-hover:opacity-100"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-2 left-0 w-0.5 h-0.5 bg-indigo-400/60 rounded-full animate-twinkle opacity-0 group-hover:opacity-100"
                style={{ animationDelay: "0.8s" }}
              />
            </>
          )}
        </div>

        {/* Main Icon with Enhanced Animation */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            isAnimating
              ? "rotate-[360deg] scale-125"
              : "rotate-0 scale-100 group-hover:scale-110 group-hover:rotate-12"
          }`}>
          {currentTheme === "dark" ? (
            <div className="relative">
              {/* Sun Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  isAnimating
                    ? "bg-yellow-400/30 animate-ping scale-150"
                    : "bg-yellow-500/20 group-hover:bg-yellow-400/25 group-hover:animate-pulse"
                }`}
              />

              {/* Animated Sun Icon */}
              <Sun
                className={`relative h-6 w-6 transition-all duration-700 ${
                  isAnimating
                    ? "text-yellow-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    : "text-yellow-500 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                }`}
              />

              {/* Rotating Sun Rays */}
              <div
                className={`absolute inset-0 transition-transform duration-[3000ms] ease-linear ${
                  isAnimating
                    ? "rotate-[180deg]"
                    : "rotate-0 group-hover:rotate-[30deg]"
                }`}>
                <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-yellow-400/50 transform -translate-x-1/2 -translate-y-0.5 rounded-full" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 bg-yellow-400/50 transform -translate-x-1/2 translate-y-0.5 rounded-full" />
                <div className="absolute left-0 top-1/2 w-1.5 h-0.5 bg-yellow-400/50 transform -translate-y-1/2 -translate-x-0.5 rounded-full" />
                <div className="absolute right-0 top-1/2 w-1.5 h-0.5 bg-yellow-400/50 transform -translate-y-1/2 translate-x-0.5 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Moon Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  isAnimating
                    ? "bg-blue-400/30 animate-ping scale-150"
                    : "bg-blue-500/20 group-hover:bg-blue-400/25 group-hover:animate-pulse"
                }`}
              />

              {/* Animated Moon Icon */}
              <Moon
                className={`relative h-6 w-6 transition-all duration-700 ${
                  isAnimating
                    ? "text-blue-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                }`}
              />

              {/* Moon Crescent Effect */}
              <div
                className={`absolute top-1 right-1 w-3 h-3 bg-gray-100 dark:bg-gray-900 rounded-full transition-all duration-500 ${
                  isAnimating
                    ? "scale-110 opacity-80"
                    : "scale-100 opacity-60 group-hover:opacity-70"
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Shimmer Effect */}
      <div
        className={`absolute inset-0 rounded-xl overflow-hidden ${
          isAnimating ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
        <div
          className={`absolute inset-0 transition-transform duration-1000 ${
            isAnimating
              ? "translate-x-full"
              : "-translate-x-full group-hover:translate-x-full"
          } ${
            currentTheme === "dark"
              ? "bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          } rounded-xl`}
        />
      </div>

      {/* Pulse Ring Effect */}
      <div
        className={`absolute inset-0 rounded-xl border-2 transition-all duration-1000 ${
          currentTheme === "dark"
            ? "border-yellow-400/30"
            : "border-blue-400/30"
        } ${
          isAnimating
            ? "scale-150 opacity-0 animate-ping"
            : "scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-50"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
