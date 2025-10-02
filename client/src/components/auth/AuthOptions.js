import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const AuthOptions = () => {
  return (
    <div className="auth-container">
      <div className="auth-card auth-options">
        <h1>Welcome to YouMatter</h1>
        <p>Your journey to better health and wealth begins here</p>
        <div className="auth-buttons">
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/signup" className="auth-button secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthOptions;
