import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/challenges", label: "Challenges", icon: "🎯" },
    { path: "/rewards", label: "Rewards", icon: "🎁" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">💜</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              YouMatter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  Level {user?.level || 1}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">
                    {user?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    Level {user?.level || 1}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
