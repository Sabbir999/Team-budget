import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { DollarSign, Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setError('');
      setDebugInfo('');
      setLoading(true);
      
      console.log('Sending password reset to:', email);
      
      // Use the actionCodeSettings for better email delivery
      const actionCodeSettings = {
        url: window.location.origin + '/login', // Where to redirect after reset
        handleCodeInApp: false // Set to true if you're handling the reset in your app
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      console.log('Password reset email sent successfully');
      setSuccess(true);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setDebugInfo(`Error code: ${error.code}, Message: ${error.message}`);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address. Please check the email or create a new account.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again in a few minutes.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError('Failed to send reset email. Please try again or contact support.');
      }
    }
    
    setLoading(false);
  }

  const handleResendEmail = () => {
    setSuccess(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          <div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TeamBudget
                </h1>
                <p className="text-sm text-gray-500">Sports Team Manager</p>
              </div>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Debug info - remove in production */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-mono">{debugInfo}</p>
            </div>
          )}

          <div className="mt-8">
            {error && !success && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Unable to send reset email
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success ? (
              <div className="rounded-lg bg-green-50 p-6 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Check your email
                    </h3>
                    <div className="mt-2 text-sm text-green-700 space-y-2">
                      <p>
                        We've sent a password reset link to <strong>{email}</strong>.
                      </p>
                      <p>
                        <strong>Can't find the email?</strong> Check your:
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Inbox (look for "TeamBudget Password Reset")</li>
                        <li>Spam or junk folder</li>
                        <li>Promotions tab (Gmail users)</li>
                      </ul>
                      <p className="mt-2 text-yellow-700">
                        <strong>Note:</strong> The link expires in 1 hour.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleResendEmail}
                    className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Send to a different email
                  </button>
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send reset link
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Back to login
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Troubleshooting Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Check spam/junk folders</li>
              <li>• Ensure you're checking the correct email account</li>
              <li>• Try a different email provider if possible</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Reset Your Password
              </h3>
              <p className="text-lg text-white/80 mb-6">
                We'll send you a secure link to reset your password and get you back to managing your team.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">Secure password reset</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">Link expires in 1 hour</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">Check your spam folder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}