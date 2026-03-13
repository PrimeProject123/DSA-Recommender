import { Sparkles, Zap, Users, Star } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Feedback() {
  const router = useRouter();
  const { setId } = router.query;

  // Feedback data for different practice sets
  const feedbackData = {
    230: {
      name: "Pushkar",
      problemsSolved: 5,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "120 ms",
      memory: "20.5 MB",
      strengths: [
        "Two-pointer pattern clicked - solved Container With Most Water in 8 mins (best time yet).",
        "Dynamic Programming intuition improving - cracked House Robber with memoization without hints."
      ],
      mistakes: [
        "Edge case handling weak - failed hidden tests in Merge Intervals and Product of Array Except Self.",
        "Binary Search boundary confusion - off-by-one errors in 3 problems (Find Peak Element, etc.)."
      ],
      takeaways: [
        "Dry-run 2-3 test cases before writing full code.",
        "Always check constraints (n, input range) to avoid unnecessary recursion."
      ]
    },
    231: {
      name: "Pushkar",
      problemsSolved: 3,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "95 ms",
      memory: "18.2 MB",
      strengths: [
        "Array manipulation skills strong - solved Rotate Array efficiently.",
        "Good understanding of basic data structures - implemented Stack operations correctly."
      ],
      mistakes: [
        "Time complexity optimization needed - brute force approach used in some problems.",
        "Variable naming could be more descriptive for better code readability."
      ],
      takeaways: [
        "Always consider time complexity before implementing solution.",
        "Use meaningful variable names for better code maintenance."
      ]
    },
    232: {
      name: "Pushkar",
      problemsSolved: 4,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "110 ms",
      memory: "19.8 MB",
      strengths: [
        "String manipulation improving - solved Valid Parentheses efficiently.",
        "Good debugging skills - identified and fixed logic errors quickly."
      ],
      mistakes: [
        "Recursion depth issues - stack overflow in complex recursive problems.",
        "Memory management - created unnecessary arrays in some solutions."
      ],
      takeaways: [
        "Consider iterative solutions for deep recursion problems.",
        "Optimize memory usage by reusing existing data structures."
      ]
    },
    233: {
      name: "Pushkar",
      problemsSolved: 6,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "105 ms",
      memory: "21.1 MB",
      strengths: [
        "Excellent problem-solving approach - broke down complex problems effectively.",
        "Strong mathematical thinking - solved number theory problems efficiently."
      ],
      mistakes: [
        "Over-engineering simple problems - used complex algorithms where simple ones sufficed.",
        "Documentation lacking - code comments could be more comprehensive."
      ],
      takeaways: [
        "Start with the simplest solution that works, then optimize if needed.",
        "Add comments to explain complex logic for future reference."
      ]
    },
    234: {
      name: "Pushkar",
      problemsSolved: 2,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "88 ms",
      memory: "17.5 MB",
      strengths: [
        "Quick problem understanding - grasped problem requirements rapidly.",
        "Clean code writing - well-structured and readable solutions."
      ],
      mistakes: [
        "Limited problem exposure - need to practice more diverse problem types.",
        "Test case coverage - missed some edge cases in validation."
      ],
      takeaways: [
        "Practice problems from different categories to build versatility.",
        "Always test with edge cases and boundary conditions."
      ]
    },
    235: {
      name: "Pushkar",
      problemsSolved: 7,
      level: "Beginner",
      nextLevel: "Intermediate",
      runtime: "115 ms",
      memory: "22.3 MB",
      strengths: [
        "Excellent pattern recognition - identified common algorithms quickly.",
        "Strong analytical skills - solved optimization problems effectively."
      ],
      mistakes: [
        "Time pressure handling - rushed through some problems leading to errors.",
        "Algorithm selection - sometimes chose suboptimal approaches."
      ],
      takeaways: [
        "Take time to plan before coding, even under pressure.",
        "Review multiple approaches before implementing the solution."
      ]
    }
  };

  const currentFeedback = feedbackData[setId] || feedbackData[230];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">LeetGenie</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-8">
              <Link href="/dashboard">
                <button className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </button>
              </Link>
              <Link href="/past-records">
                <button className="text-gray-500 hover:text-gray-700">
                  Past Records
                </button>
              </Link>
              <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Report
              </button>
            </div>

            {/* Streak and Profile */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center">
                <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">2-days Streak</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">P</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Illustration */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
            <Users className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Your Feedback</h1>

        {/* Personalized Message */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            Great job, {currentFeedback.name}! You've solved {currentFeedback.problemsSolved} {currentFeedback.level} problems. 
            Moving to {currentFeedback.nextLevel} now.
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-600">
            <span>Runtime: {currentFeedback.runtime}</span>
            <span>Memory: {currentFeedback.memory}</span>
          </div>
        </div>

        {/* Feedback Sections */}
        <div className="space-y-6">
          {/* Strengths & Wins */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Strengths & Wins</h2>
            <ul className="space-y-3">
              {currentFeedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <Star className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mistakes & Gaps */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mistakes & Gaps</h2>
            <ul className="space-y-3">
              {currentFeedback.mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Takeaways */}
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
            <ul className="space-y-3">
              {currentFeedback.takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/past-records">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Back to Past Records
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
