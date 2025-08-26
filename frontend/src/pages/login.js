import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulate API call delay
    setTimeout(() => {
      if (activeTab === 'signup') {
        setMessage('✅ Signup successful! Redirecting to personalization...');
        setTimeout(() => {
          router.push('/personalize');
        }, 2000);
      } else {
        setMessage('✅ Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setMessage('🔄 Connecting with Google...');
    
    setTimeout(() => {
      setMessage('✅ Google login successful! Redirecting to personalization...');
      setTimeout(() => {
        router.push('/personalize');
      }, 2000);
      setIsLoading(false);
    }, 1500);
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
            <h1 className="text-2xl font-bold text-white">LeetGenie</h1>
          </div>
          <p className="text-gray-300 text-xs max-w-sm">
            Personalized coding paths. Intelligent progress tracking. Built to get you hired.
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="w-full max-w-sm">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('✅') ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
              }`}>
                {message}
              </div>
            )}

            {/* Tabs */}
            <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'bg-yellow-500 text-gray-800'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'signup'
                    ? 'bg-yellow-500 text-gray-800'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-gray-800 py-2 px-3 rounded-lg font-medium flex items-center justify-center mb-4 hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Separator */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-800 text-gray-400">
                  OR {activeTab.toUpperCase()} WITH
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {activeTab === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-yellow-500 text-xs hover:text-yellow-400">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : (activeTab === 'login' ? 'Log In' : 'Start Coding...')}
              </button>
            </form>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4">
          <Link href="/" className="text-gray-300 hover:text-white text-xs">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
