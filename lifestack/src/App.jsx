import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { sportsRoutes } from "./modules/sports/sportsRoutes";
import { tripsRoutes } from "./modules/trips/tripsRoutes";
import { peopleRoutes } from "./modules/people/peopleRoutes";
import { blogRoutes } from "./modules/blog/blogRoutes";

import SharedTripPage from "./modules/trips/pages/SharedTripPage";
import SharedBlogPostPage from "./modules/blog/pages/SharedBlogPostPage";

const publicAuthRoutes = ["/login", "/register", "/forgot-password"];

function isSharedTripRoute(pathname) {
  return pathname.startsWith("/trips/share/");
}

function isSharedBlogRoute(pathname) {
  return pathname.startsWith("/blog/share/");
}

function isPublicRoute(pathname) {
  return (
    publicAuthRoutes.includes(pathname) ||
    isSharedTripRoute(pathname) ||
    isSharedBlogRoute(pathname)
  );
}

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [currentUser, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return currentUser ? children : null;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/sports", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return currentUser ? null : children;
}

function AuthRedirectGuard() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!currentUser && !isPublicRoute(location.pathname)) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (currentUser && publicAuthRoutes.includes(location.pathname)) {
      navigate("/sports", { replace: true });
    }
  }, [currentUser, loading, location.pathname, navigate]);

  return null;
}

function AppContent() {
  const { loading, currentUser } = useAuth();

  if (loading && currentUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading LifeStack..." />
      </div>
    );
  }

  return (
    <>
      <AuthRedirectGuard />

      <Routes>
        {/* Public auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Public shared routes */}
        <Route path="/trips/share/:shareId" element={<SharedTripPage />} />
        <Route
          path="/blog/share/:userId/:shareId"
          element={<SharedBlogPostPage />}
        />

        {/* Protected app routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/sports" replace />} />

          {sportsRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

          {tripsRoutes
            .filter((route) => route.path !== "trips/share/:shareId")
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

          {peopleRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

          {blogRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

          <Route path="settings" element={<Settings />} />

          {/* Old route redirects */}
          <Route path="dashboard" element={<Navigate to="/sports" replace />} />
          <Route path="teams" element={<Navigate to="/sports" replace />} />
          <Route path="players" element={<Navigate to="/sports" replace />} />
          <Route path="expenses" element={<Navigate to="/sports" replace />} />
          <Route path="payments" element={<Navigate to="/sports" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/sports" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}