import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Expenses from './pages/Expenses';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import LoadingSpinner from './components/common/LoadingSpinner';

// Enhanced Protected Route Component with navigation blocking
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !currentUser) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname } // Store where they tried to go
      });
    }
  }, [currentUser, loading, navigate, location]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Only render children if user is authenticated
  return currentUser ? children : null;
}

// Enhanced Public Route Component with navigation blocking
function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and user is already logged in, redirect to dashboard
    if (!loading && currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Only render children if user is NOT authenticated
  return !currentUser ? children : null;
}

// Route History Blocker to prevent back/forward navigation issues
function RouteHistoryBlocker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle browser back/forward button
    const handlePopState = (event) => {
      if (!currentUser && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgot-password') {
        // If user is not logged in and trying to access protected routes via browser buttons
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentUser, navigate, location]);

  return null;
}

// Authentication Check Component
function AuthChecker() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent access to protected routes when not authenticated
    const protectedRoutes = ['/', '/teams', '/players', '/expenses', '/payments', '/settings'];
    
    if (!loading && !currentUser && protectedRoutes.includes(location.pathname)) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }

    // Prevent authenticated users from accessing auth pages
    if (!loading && currentUser && ['/login', '/register', '/forgot-password'].includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [currentUser, loading, location, navigate]);

  return null;
}

function AppContent() {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking initial auth state
  if (loading && currentUser === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading TeamBudget..." />
      </div>
    );
  }

  return (
    <>
      <RouteHistoryBlocker />
      <AuthChecker />
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
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

        {/* Protected Routes - Only accessible when logged in */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="teams" element={<Teams />} />
          <Route path="players" element={<Players />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback route - handles all undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
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