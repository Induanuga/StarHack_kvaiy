import React, { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("overall");
  const [period, setPeriod] = useState("all");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, period]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
        params: activeTab === "overall" ? { period } : {}, // No limit parameter
      };

      const res = await axios.get(
        `http://localhost:5000/api/leaderboard/${activeTab}`,
        config
      );

      setLeaderboardData(res.data.leaderboard); // ALL users
      if (res.data.currentUser) {
        setCurrentUserData(res.data.currentUser);
      }
      if (res.data.totalUsers) {
        setTotalUsers(res.data.totalUsers);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overall", label: "Overall", icon: "🏆" },
    { id: "health", label: "Health", icon: "💪" },
    { id: "wealth", label: "Wealth", icon: "💰" },
    { id: "family", label: "Family Groups", icon: "👨‍👩‍👧‍👦" },
  ];

  const periods = [
    { value: "all", label: "All Time" },
    { value: "monthly", label: "This Month" },
    { value: "weekly", label: "This Week" },
    { value: "daily", label: "Today" },
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-purple-500 to-pink-500";
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🏅";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Complete rankings of all {totalUsers.toLocaleString()} users!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Period Filter (only for overall) */}
        {activeTab === "overall" && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {periods.map((p) => (
              <button
                key={p.value}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  period === p.value
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Current User Rank Card */}
        {currentUserData && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Your Rank</p>
                <p className="text-4xl font-bold">#{currentUserData.rank}</p>
                <p className="text-sm opacity-90 mt-1">
                  out of {totalUsers.toLocaleString()} users
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl mb-2">
                  {getRankEmoji(currentUserData.rank)}
                </div>
                <div className="text-2xl font-bold">
                  {currentUserData.points.toLocaleString()}
                </div>
                <div className="text-xs opacity-90">points</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List - ALL USERS */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              Showing all {leaderboardData.length.toLocaleString()}{" "}
              {activeTab === "family" ? "groups" : "users"}
            </p>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.userId || entry.groupId || index}
                className={`flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  entry.isCurrentUser
                    ? "bg-purple-50 border-l-4 border-l-purple-600 sticky top-0 z-10"
                    : ""
                }`}
              >
                {/* Rank Badge */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(
                    entry.rank
                  )} flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}
                >
                  {entry.rank <= 3 ? getRankEmoji(entry.rank) : entry.rank}
                </div>

                {/* Avatar */}
                {entry.username && (
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 truncate">
                      {entry.username || entry.name}
                    </h3>
                    {entry.isCurrentUser && (
                      <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {activeTab === "overall" &&
                      `Level ${entry.level} • ${entry.challengesCompleted} challenges completed`}
                    {activeTab === "health" &&
                      `${entry.healthChallenges} health challenges completed`}
                    {activeTab === "wealth" &&
                      `${entry.wealthChallenges} wealth challenges completed`}
                    {activeTab === "family" &&
                      `${entry.memberCount} members • Level ${entry.groupLevel}`}
                  </p>
                  {entry.streak > 0 && (
                    <p className="text-xs text-orange-600 font-semibold mt-1">
                      🔥 {entry.streak} day streak
                    </p>
                  )}
                </div>

                {/* Points/Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {entry.points || entry.groupPoints || entry.totalPoints || 0}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>

          {leaderboardData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">🏆</div>
              <p className="text-gray-500">No data available yet</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-xl font-bold text-gray-800">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">All Users Shown</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xl font-bold text-gray-800">
              {leaderboardData[0]?.points?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-500">Top Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xl font-bold text-gray-800">
              {leaderboardData.length > 0
                ? Math.round(
                    leaderboardData.reduce(
                      (sum, e) => sum + (e.points || 0),
                      0
                    ) / leaderboardData.length
                  ).toLocaleString()
                : 0}
            </div>
            <div className="text-xs text-gray-500">Avg Points</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xl font-bold text-gray-800">
              {currentUserData?.rank ? `#${currentUserData.rank}` : "-"}
            </div>
            <div className="text-xs text-gray-500">Your Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
