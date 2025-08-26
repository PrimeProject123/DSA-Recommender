import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Personalize() {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [showPreparationDropdown, setShowPreparationDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedPreparation, setSelectedPreparation] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [validationError, setValidationError] = useState('');
  const router = useRouter();

  const programmingLanguages = ['C', 'C++', 'Python', 'Java', 'HTML', 'Swift', 'CSS'];
  const topics = ['Arrays', 'Strings', 'Recursion', 'Trees', 'BFS', 'LFS', 'Dynamic Programming', 'Bubble short', 'No Topic'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const preparationGoals = ['Internship', 'Placement (Tech)', 'Competitive Exams', 'Improving problem-solving skills'];
  const dailyTargets = ['2 Question/day', '3 Question/day', '4 Question/day'];

  const toggleLanguage = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const selectExperience = (level) => {
    setSelectedExperience(level);
    // Remove the auto-close so it stays open like programming languages
  };

  const selectPreparation = (goal) => {
    setSelectedPreparation(goal);
    // Remove the auto-close so it stays open like programming languages
  };

  const selectTarget = (target) => {
    setSelectedTarget(target);
    // Remove the auto-close so it stays open like programming languages
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const openDropdown = (dropdownType) => {
    // Check if the clicked dropdown is already open, if so close it
    const isCurrentlyOpen = 
      (dropdownType === 'language' && showLanguageDropdown) ||
      (dropdownType === 'experience' && showExperienceDropdown) ||
      (dropdownType === 'preparation' && showPreparationDropdown) ||
      (dropdownType === 'target' && showTargetDropdown) ||
      (dropdownType === 'topics' && showTopicsDropdown);

    // Close all dropdowns first
    setShowLanguageDropdown(false);
    setShowTopicsDropdown(false);
    setShowExperienceDropdown(false);
    setShowPreparationDropdown(false);
    setShowTargetDropdown(false);
    
    // If the clicked dropdown was not open, then open it
    if (!isCurrentlyOpen) {
      switch (dropdownType) {
        case 'language':
          setShowLanguageDropdown(true);
          break;
        case 'experience':
          setShowExperienceDropdown(true);
          break;
        case 'preparation':
          setShowPreparationDropdown(true);
          break;
        case 'target':
          setShowTargetDropdown(true);
          break;
        case 'topics':
          setShowTopicsDropdown(true);
          break;
      }
    }
  };

  const handleGoToDashboard = () => {
    // Validate all required fields
    if (selectedLanguages.length === 0) {
      setValidationError('Please select at least one programming language');
      return;
    }
    if (!selectedExperience) {
      setValidationError('Please select your experience level');
      return;
    }
    if (!selectedPreparation) {
      setValidationError('Please select what you are preparing for');
      return;
    }
    if (!selectedTarget) {
      setValidationError('Please select your daily practice target');
      return;
    }
    if (selectedTopics.length === 0) {
      setValidationError('Please select at least one topic you are confident in');
      return;
    }

    // All validations passed
    setValidationError('');
    router.push('/dashboard');
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/loginBg.png)'
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        {/* Header/Branding */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <h1 className="text-2xl font-bold text-white">CodeAscend</h1>
          </div>
          <p className="text-gray-300 text-xs max-w-sm">
            Personalized coding paths. Intelligent progress tracking. Built to get you hired.
          </p>
        </div>

        {/* Personalization Form */}
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Let's personalize your practice plan</h2>

            {/* Validation Error */}
            {validationError && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg text-sm">
                {validationError}
              </div>
            )}

            {/* Programming Languages */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm">Select Programming Language(s) *</label>
                <button 
                  onClick={() => openDropdown('language')}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showLanguageDropdown && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {programmingLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => toggleLanguage(language)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedLanguages.includes(language)
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm">Your current experience level in coding *</label>
                <button 
                  onClick={() => openDropdown('experience')}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showExperienceDropdown && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => selectExperience(level)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedExperience === level
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preparation Goal */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm">What are you currently preparing for? *</label>
                <button 
                  onClick={() => openDropdown('preparation')}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showPreparationDropdown && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {preparationGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => selectPreparation(goal)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedPreparation === goal
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Practice Target */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm">Daily Practice Target *</label>
                <button 
                  onClick={() => openDropdown('target')}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showTargetDropdown && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {dailyTargets.map((target) => (
                    <button
                      key={target}
                      onClick={() => selectTarget(target)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTarget === target
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Confident Topics */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm">Topics you're confident in *</label>
                <button 
                  onClick={() => openDropdown('topics')}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showTopicsDropdown && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTopics.includes(topic)
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Go to Dashboard Button */}
            <button 
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="mt-4">
          <Link href="/login" className="text-gray-300 hover:text-white text-xs">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
