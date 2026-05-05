import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { sportsRoutes } from "./modules/sports/sportsRoutes";
import { tripsRoutes } from "./modules/trips/tripsRoutes";
import { peopleRoutes } from "./modules/people/peopleRoutes";
import SharedTripPage from "./modules/trips/pages/SharedTripPage";

const publicAuthRoutes = ["/login", "/register", "/forgot-password"];

function isSharedTripRoute(pathname) {
  return pathname.startsWith("/trips/share/");
}

function isPublicRoute(pathname) {
  return publicAuthRoutes.includes(pathname) || isSharedTripRoute(pathname);
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
  }, [currentUser, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return !currentUser ? children : null;
}

function RouteHistoryBlocker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      if (!currentUser && !isPublicRoute(location.pathname)) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentUser, navigate, location]);

  return null;
}

function AuthChecker() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser && !isPublicRoute(location.pathname)) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }

    if (
      !loading &&
      currentUser &&
      publicAuthRoutes.includes(location.pathname)
    ) {
      navigate("/sports", { replace: true });
    }
  }, [currentUser, loading, location, navigate]);

  return null;
}

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading && currentUser === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading LifeStack..." />
      </div>
    );
  }

  return (
    <>
      <RouteHistoryBlocker />
      <AuthChecker />

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

        {/* Public shared trip route */}
        <Route path="/trips/share/:shareId" element={<SharedTripPage />} />

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

          <Route path="settings" element={<Settings />} />

          {/* Temporary old route redirects */}
          <Route path="dashboard" element={<Navigate to="/sports" replace />} />
          <Route path="teams" element={<Navigate to="/sports/teams" replace />} />
          <Route path="players" element={<Navigate to="/sports/players" replace />} />
          <Route path="expenses" element={<Navigate to="/sports/expenses" replace />} />
          <Route path="payments" element={<Navigate to="/sports/payments" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/sports" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;