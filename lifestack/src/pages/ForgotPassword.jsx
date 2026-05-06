import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Layers,
} from "lucide-react";

import { auth } from "../firebase-config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setSuccess(true);
    } catch (resetError) {
      console.error("Password reset error:", resetError);

      switch (resetError.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setError(
            "No account found with this email address. Please check the email or create a new account."
          );
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again in a few minutes.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleResendEmail = () => {
    setSuccess(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link
            to="/login"
            className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <div>
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>

              <div className="ml-3">
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  LifeStack Hub
                </h1>

                <p className="text-sm text-gray-500">
                  Organize real life in one place
                </p>
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we will send you a secure link to
              reset your password.
            </p>
          </div>

          <div className="mt-8">
            {error && !success && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>

                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Unable to send reset email
                    </h3>

                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>

                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Check your email
                    </h3>

                    <div className="mt-2 space-y-2 text-sm text-green-700">
                      <p>
                        We sent a password reset link to{" "}
                        <strong>{email}</strong>.
                      </p>

                      <p>
                        <strong>Can’t find the email?</strong> Check your:
                      </p>

                      <ul className="ml-4 list-inside list-disc">
                        <li>Inbox</li>
                        <li>Spam or junk folder</li>
                        <li>Promotions tab if you use Gmail</li>
                      </ul>

                      <p className="mt-2 text-yellow-700">
                        <strong>Note:</strong> The reset link may expire, so use
                        it as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="inline-flex items-center text-sm font-medium text-green-700 transition-colors hover:text-green-600"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Send to a different email
                  </button>

                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-green-700 transition-colors hover:text-green-600"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-300 py-3 pl-10 pr-3 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                    >
                      Back to login
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              Troubleshooting tips
            </h4>

            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Check spam or junk folders</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes and try again if the email is delayed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="relative hidden flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 lg:block">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex h-full items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h3 className="mb-4 text-3xl font-bold">
                Get back into LifeStack Hub
              </h3>

              <p className="mb-6 text-lg text-white/80">
                Reset your password and continue organizing your people, plans,
                money, and updates in one place.
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <span className="text-white/90">Secure password reset</span>
                </div>

                <div className="flex items-center">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <span className="text-white/90">
                    Email-based recovery link
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <span className="text-white/90">
                    Return to your LifeStack Hub workspace
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}