import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [analytics, setAnalytics] = useState(null);
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

      const res = await axios.get(
        "http://localhost:5000/api/analytics/dashboard",
        config
      );
      setKpis(res.data.kpis);
      setAnalytics(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
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
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time platform metrics and KPIs
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">👥</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {kpis?.totalUsers?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">📈</div>
              <div className="text-xs text-gray-500">Rate</div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {kpis?.engagementRate?.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Engagement Rate</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">✅</div>
              <div className="text-xs text-gray-500">Success</div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {kpis?.avgCompletionRate?.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Completion Rate</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">💰</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              ${kpis?.totalRevenue?.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📈 User Growth (Last 30 Days)
            </h3>
            <div className="space-y-2">
              {analytics?.charts.userGrowth.slice(-7).map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 w-20">
                    {new Date(data.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.min((data.value / 50) * 100, 100)}%`,
                      }}
                    >
                      <span className="text-xs text-white font-bold">
                        {data.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ⚡ Daily Active Users
            </h3>
            <div className="space-y-2">
              {analytics?.charts.engagement.slice(-7).map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 w-20">
                    {new Date(data.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.min((data.value / 100) * 100, 100)}%`,
                      }}
                    >
                      <span className="text-xs text-white font-bold">
                        {data.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-3">🎯</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {kpis?.avgEngagementScore?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Avg Engagement Score</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-3">💵</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              ${kpis?.revenuePerUser?.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Revenue Per User</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-3">⚡</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {kpis?.activeUsers?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Active Users (30d)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
