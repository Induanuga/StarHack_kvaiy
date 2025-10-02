import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to YouMatter</h1>
        <p>Your journey to better health and wealth begins here</p>
        <div className="auth-buttons">
          <button onClick={() => navigate('/login')} className="btn-primary">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="btn-secondary">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;