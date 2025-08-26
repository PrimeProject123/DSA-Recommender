import { Sparkles, Zap, RefreshCw, Mic, FileText, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [aiInput, setAiInput] = useState('');

    const handleSuggestionClick = (suggestion) => {
    setAiInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">CodeAscend</h1>
            </div>

                         {/* Navigation Tabs */}
             <div className="flex space-x-8">
               <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                 Dashboard
               </button>
               <Link href="/past-records">
                 <button className="text-gray-500 hover:text-gray-700">
                   Past Records
                 </button>
               </Link>
               <button className="text-gray-500 hover:text-gray-700">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hello xyz, Ready to solve today's challenges?
              </h2>
              <p className="text-gray-600">
                You're currently on beginner level-2 more to go until intermediate.
              </p>
            </div>

            {/* Today's Practice Set */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Today Practice Set #234</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-900">Question 1.</span> Find the Kth Largest Element in an Array
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-900">Question 2.</span> Check if a Binary Tree is Balanced
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-900">Question 3.</span> Implement Queue using Two Stacks
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Next Practice Set
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Practice
                </button>
              </div>
            </div>

                         {/* AI Assistant Section */}
             <div className="bg-white rounded-lg p-6 shadow-sm">
               <div className="relative mb-4">
                 <input 
                   type="text" 
                   value={aiInput}
                   onChange={(e) => setAiInput(e.target.value)}
                   placeholder="Ask AI what do you want to do!" 
                   className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
                 <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
               </div>
               <div className="flex flex-wrap gap-2">
                 <button 
                   onClick={() => handleSuggestionClick("Give me a different problem on Binary Trees.")}
                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                 >
                   Give me a different problem on Binary Trees.
                 </button>
                 <button 
                   onClick={() => handleSuggestionClick("Easier problems on Arrays.")}
                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                 >
                   Easier problems on Arrays.
                 </button>
                 <button 
                   onClick={() => handleSuggestionClick("Swap out question 2 with a harder one.")}
                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                 >
                   Swap out question 2 with a harder one.
                 </button>
                 <button 
                   onClick={() => handleSuggestionClick("Change today's practice to include Graphs and Hash Maps.")}
                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                 >
                   Change today's practice to include Graphs and Hash Maps.
                 </button>
                 <button 
                   onClick={() => handleSuggestionClick("Focus today's practice on my weak areas.")}
                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                 >
                   Focus today's practice on my weak areas.
                 </button>
               </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileText className="w-4 h-4 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Key Takeaways</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Quick wins on arrays — Two Sum in 7 mins.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Strong pattern spotting in sliding window — Anagram Finder.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Missed edge cases — failed empty input in Merge Intervals.
                </li>
              </ul>
            </div>

            {/* Improvement Plan */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Improvement Plan</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Redo tricky Binary Search problems — Search Rotated Array.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Test 3 edge cases before submit — empty, single, max.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Dry-run logic with simple inputs — Koko Eating Bananas.
                </li>
              </ul>
            </div>

            {/* This Week Plans */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">This Week Plans</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Introduction & Arrays</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Graphs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Linked Lists</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm">Stacks & Queues</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm">Hash Maps (Hash Tables)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm">Trees (Binary Trees & BSTs)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm">Dynamic Programming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
