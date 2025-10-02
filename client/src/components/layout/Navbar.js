import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">YouMatter</Link>
      </div>
      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/challenges">Challenges</Link></li>
            <li><Link to="/rewards">Rewards</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;