import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Challenges from './components/challenges/Challenges';
import Profile from './components/profile/Profile';
import Rewards from './components/rewards/Rewards';
import Login from './components/auth/Login';
import AuthOptions from './components/auth/AuthOptions';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
            <Route path="/auth" element={<AuthOptions />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;