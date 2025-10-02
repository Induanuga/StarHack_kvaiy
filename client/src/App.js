import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Challenges from "./components/challenges/Challenges";
import Profile from "./components/profile/Profile";
import Rewards from "./components/rewards/Rewards";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AuthOptions from "./components/auth/AuthOptions";
import PrivateRoute from "./components/routing/PrivateRoute";
import CommunityChallenges from "./components/community/CommunityChallenges";
import HealthcarePartners from "./components/healthcare/HealthcarePartners";
import CorporateDashboard from "./components/corporate/CorporateDashboard";
import AdminDashboard from "./components/analytics/AdminDashboard";
import PublicHealthCampaigns from "./components/publicHealth/PublicHealthCampaigns";

// Loading component
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Main app content that shows different views based on auth state
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public routes (only show when not authenticated) */}
        {!isAuthenticated ? (
          <>
            <Route path="/auth" element={<AuthOptions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          <>
            {/* Private routes (only show when authenticated) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <PrivateRoute>
                  <Challenges />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <PrivateRoute>
                  <Rewards />
                </PrivateRoute>
              }
            />
            <Route
              path="/community"
              element={
                <PrivateRoute>
                  <CommunityChallenges />
                </PrivateRoute>
              }
            />
            <Route
              path="/healthcare"
              element={
                <PrivateRoute>
                  <HealthcarePartners />
                </PrivateRoute>
              }
            />
            <Route
              path="/corporate"
              element={
                <PrivateRoute>
                  <CorporateDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/public-health"
              element={
                <PrivateRoute>
                  <PublicHealthCampaigns />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
