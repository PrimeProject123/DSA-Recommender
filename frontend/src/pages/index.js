import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="h-screen bg-[#F5F8FC] dark:bg-gray-900 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Abstract shapes and dashed lines */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute top-30 left-30 w-3 h-3 bg-blue-400 rounded-full opacity-25"></div>

        <div className="absolute top-16 right-16 w-6 h-6 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-26 right-26 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute top-36 right-36 w-3 h-3 bg-blue-400 rounded-full opacity-25"></div>

        {/* Dashed lines connecting elements */}
        <div
          className="absolute top-12 left-14 w-12 h-px bg-blue-300 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent, transparent 3px, #93c5fd 3px, #93c5fd 6px)",
          }}></div>
        <div
          className="absolute top-22 left-24 w-8 h-px bg-blue-300 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent, transparent 2px, #93c5fd 2px, #93c5fd 4px)",
          }}></div>

        <div
          className="absolute top-18 right-18 w-12 h-px bg-blue-300 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent, transparent 3px, #93c5fd 3px, #93c5fd 6px)",
          }}></div>
        <div
          className="absolute top-28 right-28 w-8 h-px bg-blue-300 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent, transparent 2px, #93c5fd 2px, #93c5fd 4px)",
          }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-8 pb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              CodeAscend
            </h1>
          </div>

          {/* Headline */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 leading-tight mb-2">
              <span className="text-blue-600 dark:text-blue-400">
                Personalized
              </span>{" "}
              coding paths.
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 leading-tight mb-2">
              <span className="text-blue-600 dark:text-blue-400">
                Intelligent
              </span>{" "}
              progress tracking.
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 leading-tight">
              Built to get you{" "}
              <span className="text-blue-600 dark:text-blue-400">Hired</span>.
            </h2>
          </div>

          {/* Call to Action Button */}
          <Link href="/login">
            <button className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-400 dark:hover:to-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center mx-auto">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Dashboard Preview Image Section */}
      <div className="relative z-10 pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 transform -translate-y-4">
            {/* Dashboard Preview Image */}
            <img
              src="/Screenshot 2025-08-26 001403.png"
              alt="LeetGenie Dashboard Preview"
              className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md dark:opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
