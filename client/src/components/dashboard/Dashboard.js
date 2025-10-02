import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [familyGroups, setFamilyGroups] = useState([]);
  const [topChallenges, setTopChallenges] = useState([]);
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

      const [challengeStatsRes, activitiesRes, familyGroupsRes, challengesRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/challenges/stats", config),
          axios.get("http://localhost:5000/api/activities?limit=5", config),
          axios.get("http://localhost:5000/api/family/my-groups", config),
          axios.get("http://localhost:5000/api/challenges?limit=3", config),
        ]);

      setStats(challengeStatsRes.data);
      setActivities(activitiesRes.data);
      setFamilyGroups(familyGroupsRes.data);
      setTopChallenges(challengesRes.data.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  const gamificationFeatures = [
    {
      title: "Challenges",
      description: "Complete daily, weekly, and monthly challenges",
      icon: "🎯",
      link: "/challenges",
      color: "from-blue-500 to-cyan-500",
      stats: `${stats?.activeChallenges || 0} active`,
    },
    {
      title: "Leaderboard",
      description: "Compete with others and climb the ranks",
      icon: "🏆",
      link: "/leaderboard",
      color: "from-yellow-500 to-orange-500",
      stats: "View rankings",
    },
    {
      title: "Rewards",
      description: "Redeem points for amazing prizes",
      icon: "🎁",
      link: "/rewards",
      color: "from-purple-500 to-pink-500",
      stats: `${user?.points || 0} points`,
    },
    {
      title: "Achievements",
      description: "Unlock badges and collect achievements",
      icon: "🏅",
      link: "/profile",
      color: "from-green-500 to-emerald-500",
      stats: "View profile",
    },
    {
      title: "Community",
      description: "Join collective wellness goals",
      icon: "👥",
      link: "/community",
      color: "from-indigo-500 to-purple-500",
      stats: "Join now",
    },
    {
      title: "Healthcare",
      description: "Doctor-prescribed challenges",
      icon: "🏥",
      link: "/healthcare",
      color: "from-red-500 to-pink-500",
      stats: "Get started",
    },
    {
      title: "Public Health",
      description: "Join nationwide health campaigns",
      icon: "🌍",
      link: "/public-health",
      color: "from-teal-500 to-cyan-500",
      stats: "Make impact",
    },
    {
      title: "Family Groups",
      description: "Create or join family wellness teams",
      icon: "👨‍👩‍👧‍👦",
      link: "#family",
      color: "from-orange-500 to-red-500",
      stats: `${familyGroups.length} groups`,
    },
  ];

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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-lg opacity-90">
                You're doing amazing! Keep up the great work!
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{user?.points || 0}</div>
              <div className="text-sm opacity-90">Total Points</div>
              <div className="text-3xl font-bold mt-2">
                Level {user?.level || 1}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.activeChallenges || 0}
            </div>
            <div className="text-sm text-gray-500">Active Challenges</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">
              {stats?.completedChallenges || 0}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600">
              {user?.streak?.current || 0}
            </div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-purple-600">
              {user?.xp || 0}
            </div>
            <div className="text-sm text-gray-500">Total XP</div>
          </div>
        </div>

        {/* Gamification Features Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎮 Explore Gamification Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gamificationFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-3`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {feature.description}
                </p>
                <div className="text-xs font-semibold text-purple-600">
                  {feature.stats}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ⚡ Recent Activity
            </h2>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {activity.points !== 0 && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
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
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </div>

          {/* Top Recommended Challenges */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                🎯 Recommended for You
              </h2>
              <Link
                to="/challenges"
                className="text-purple-600 font-semibold hover:text-purple-700 text-sm"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {topChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <span>💎</span>
                          <span className="font-semibold">
                            +{challenge.points} pts
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⭐</span>
                          <span className="font-semibold">
                            +{challenge.xpReward} XP
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Family Groups Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8" id="family">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              👨‍👩‍👧‍👦 My Family Groups
            </h2>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all text-sm">
              Create Group
            </button>
          </div>

          {familyGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {familyGroups.map((group) => (
                <div
                  key={group._id}
                  className="border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {group.description}
                      </p>
                    </div>
                    <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                      Level {group.groupLevel}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {group.members.length}
                      </div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {group.groupPoints}
                      </div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {group.challenges?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Challenges</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Invite Code:</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg font-mono font-bold text-purple-600">
                      {group.inviteCode}
                    </span>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {group.members.slice(0, 5).map((member, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white flex items-center justify-center text-white font-bold"
                      >
                        {member.user?.username?.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {group.members.length > 5 && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                        +{group.members.length - 5}
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                    View Group Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Family Groups Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create a group or join one with an invite code
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Create Group
                </button>
                <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                  Join with Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl">
          <div className="text-5xl mb-4">💪</div>
          <h3 className="text-2xl font-bold mb-2">Keep Going!</h3>
          <p className="text-lg opacity-90">
            "Your health is an investment, not an expense. Every challenge you
            complete brings you closer to your goals!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
