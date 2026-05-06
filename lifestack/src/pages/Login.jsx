import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Layers, LogIn } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      await login(email, password);

      navigate("/");
    } catch (loginError) {
      console.error("Login error:", loginError);

      switch (loginError.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Failed to log in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
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
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your people, trips, teams, expenses, and
              updates.
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Sign in failed
                    </h3>

                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pr-10 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in to your account
                  </>
                )}
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>

                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      New to LifeStack Hub?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create your account
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 transition-colors hover:text-blue-500"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 transition-colors hover:text-blue-500"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="relative hidden flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 lg:block">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex h-full items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <Layers className="mx-auto mb-6 h-16 w-16 text-white/90" />

              <h3 className="mb-4 text-3xl font-bold">
                One place for real life
              </h3>

              <p className="mb-6 text-lg text-white/80">
                Organize people, trips, sports teams, expenses, payments, and
                updates without jumping between different apps.
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

                  <span className="text-white/90">
                    Manage people and shared profiles
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
                    Track trips, teams, expenses, and payments
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
                    Share updates and blog posts
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