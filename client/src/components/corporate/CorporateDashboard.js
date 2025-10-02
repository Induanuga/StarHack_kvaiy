import React, { useState, useEffect } from "react";
import axios from "axios";

const CorporateDashboard = () => {
  const [corporateData, setCorporateData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // This would come from corporate login
  const corporateId = "YOUR_CORPORATE_ID"; // In production, get from auth context

  useEffect(() => {
    fetchCorporateData();
  }, []);

  const fetchCorporateData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const [dashboardRes, leaderboardRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/corporate/${corporateId}/dashboard`,
          config
        ),
        axios.get(
          `http://localhost:5000/api/corporate/${corporateId}/leaderboard`,
          config
        ),
      ]);

      setCorporateData(dashboardRes.data);
      setLeaderboard(leaderboardRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching corporate data:", err);
      setLoading(false);
    }
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🏢 {corporateData?.corporate.companyName}
          </h1>
          <p className="text-gray-600 text-lg">Corporate Wellness Dashboard</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-3xl font-bold text-gray-800">
              {corporateData?.corporate.analytics.totalEmployees}
            </div>
            <div className="text-sm text-gray-500">Total Employees</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">💎</div>
            <div className="text-3xl font-bold text-gray-800">
              {corporateData?.insights.totalPoints?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Points Earned</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-3xl font-bold text-gray-800">
              {corporateData?.insights.totalChallenges}
            </div>
            <div className="text-sm text-gray-500">Challenges Completed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-3xl font-bold text-gray-800">
              {corporateData?.insights.avgLevel}
            </div>
            <div className="text-sm text-gray-500">Average Level</div>
          </div>
        </div>

        {/* Employee Leaderboard */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏆 Employee Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((employee) => (
              <div
                key={employee._id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  #{employee.rank}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {employee.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {employee.user?.username}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {employee.department || "No Department"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {employee.userPoints}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Competitions */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎯 Active Competitions
          </h2>
          {corporateData?.corporate.competitions.filter(
            (c) => c.status === "active"
          ).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {corporateData.corporate.competitions
                .filter((c) => c.status === "active")
                .map((comp) => (
                  <div
                    key={comp._id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {comp.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{comp.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {new Date(comp.startDate).toLocaleDateString()} -{" "}
                        {new Date(comp.endDate).toLocaleDateString()}
                      </span>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                        {comp.participants.length} participants
                      </span>
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Prize:</p>
                      <p className="font-bold text-orange-600">{comp.prize}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No active competitions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
