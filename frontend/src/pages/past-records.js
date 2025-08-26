import { Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function PastRecords() {
  const [activeTab, setActiveTab] = useState('past-records');

  const practiceSets = [
    {
      id: 230,
      date: '11-03-25',
      timeTaken: '1hrs 20mins',
      image: 'digital-circuit',
      tryAgainLink: 'https://www.google.com/',
      feedbackLink: '/feedback?setId=230'
    },
    {
      id: 231,
      date: '12-03-25',
      timeTaken: '40mins',
      image: 'highway-interchange',
      tryAgainLink: '/practice-set-231',
      feedbackLink: '/feedback?setId=231'
    },
    {
      id: 232,
      date: '14-03-25',
      timeTaken: '1hrs 02mins',
      image: 'highway-dusk',
      tryAgainLink: '/practice-set-232',
      feedbackLink: '/feedback?setId=232'
    },
    {
      id: 233,
      date: '15-03-25',
      timeTaken: '1hrs 56mins',
      image: 'highway-night',
      tryAgainLink: '/practice-set-233',
      feedbackLink: '/feedback?setId=233'
    },
    {
      id: 234,
      date: '16-03-25',
      timeTaken: '52mins',
      image: 'city-night',
      tryAgainLink: '/practice-set-234',
      feedbackLink: '/feedback?setId=234'
    },
    {
      id: 235,
      date: '17-03-25',
      timeTaken: '1hrs 32mins',
      image: 'castle',
      tryAgainLink: '/practice-set-235',
      feedbackLink: '/feedback?setId=235'
    }
  ];

  const getImageStyle = (imageType) => {
    const styles = {
      'digital-circuit': 'bg-gradient-to-br from-green-800 to-green-900',
      'highway-interchange': 'bg-gradient-to-br from-teal-400 to-blue-500',
      'highway-dusk': 'bg-gradient-to-br from-orange-400 to-purple-500',
      'highway-night': 'bg-gradient-to-br from-purple-500 to-pink-500',
      'city-night': 'bg-gradient-to-br from-blue-600 to-purple-600',
      'castle': 'bg-gradient-to-br from-gray-700 to-gray-900'
    };
    return styles[imageType] || 'bg-gray-300';
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
              <Link href="/dashboard">
                <button className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </button>
              </Link>
              <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Past Records
              </button>
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
        {/* Practice Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceSets.map((set) => (
            <div key={set.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Image Placeholder */}
              <div className={`h-32 ${getImageStyle(set.image)} flex items-center justify-center`}>
                <div className="text-white text-2xl font-bold opacity-80">
                  #{set.id}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Today Practice Set #{set.id}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Date: {set.date}</p>
                  <p>Time Taken: {set.timeTaken}</p>
                </div>
                
                                 {/* Buttons */}
                 <div className="flex space-x-3">
                   <Link href={set.feedbackLink} className="flex-1">
                     <button className="w-full px-3 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                       View Feedback
                     </button>
                   </Link>
                   <a href={set.tryAgainLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                     <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                       Try Again
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
