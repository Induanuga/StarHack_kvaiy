import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const [userRes, activitiesRes, challengesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users/me", config),
        axios.get("http://localhost:5000/api/activities", config),
        axios.get("http://localhost:5000/api/challenges/my-challenges", config),
      ]);

      setStats(userRes.data);
      setActivities(activitiesRes.data.slice(0, 5));
      setChallenges(challengesRes.data.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  const levelProgress = stats ? ((stats.xp % 1000) / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.username}! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Let's crush your wellness goals today!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Points Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-purple-500">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.points || 0}
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              Total Points
            </p>
            <div className="text-green-500 text-sm font-semibold">
              +{stats?.stats?.challengesCompleted || 0} this week
            </div>
          </div>

          {/* Level Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-500">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-3xl font-bold text-gray-800">
              Level {stats?.level || 1}
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              Current Level
            </p>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {stats?.xp % 1000}/1000 XP
              </span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-orange-500">
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.streak?.current || 0} Days
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              Current Streak
            </p>
            <div className="text-orange-500 text-sm font-semibold">
              Best: {stats?.streak?.longest || 0} days
            </div>
          </div>

          {/* Achievements Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-green-500">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.stats?.achievementsUnlocked || 0}
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
              Achievements
            </p>
            <div className="text-green-500 text-sm font-semibold">
              {stats?.stats?.rewardsRedeemed || 0} rewards redeemed
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  🎯 Active Challenges
                </h2>
                <Link
                  to="/challenges"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  View All →
                </Link>
              </div>
              {challenges.length > 0 ? (
                <div className="space-y-4">
                  {challenges.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: item.challenge.color }}
                      >
                        {item.challenge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.challenge.title}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.challenge.category}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (item.progress / item.target) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {item.progress}/{item.target}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        +{item.challenge.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">🎯</div>
                  <p className="text-gray-500 mb-4">No active challenges yet</p>
                  <Link
                    to="/challenges"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Browse Challenges
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📊 Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Challenges Completed
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats?.stats?.challengesCompleted || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Total XP Earned
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats?.xp || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    Rewards Redeemed
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.stats?.rewardsRedeemed || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                ⚡ Recent Activity
              </h2>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 truncate">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {activity.points !== 0 && (
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            activity.points > 0
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {activity.points > 0 ? "+" : ""}
                          {activity.points}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-3">💪 Daily Motivation</h3>
              <p className="text-purple-100 italic mb-4">
                "Small steps every day lead to big changes. Keep going!"
              </p>
              <Link
                to="/challenges"
                className="inline-block w-full bg-white text-purple-600 text-center px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Start a Challenge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
