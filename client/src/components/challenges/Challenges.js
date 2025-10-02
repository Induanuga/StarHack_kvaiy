import React, { useState, useEffect } from "react";
import axios from "axios";
import ChallengeProgress from "./ChallengeProgress";
import "./Challenges.css";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [progressModal, setProgressModal] = useState(null);
  const [progressAmount, setProgressAmount] = useState("");

  useEffect(() => {
    fetchChallenges();
    fetchStats();
  }, [filter, typeFilter, activeTab]);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
        params: {},
      };

      if (activeTab === "available") {
        if (filter !== "all") config.params.category = filter;
        if (typeFilter !== "all") config.params.type = typeFilter;

        // This endpoint now returns AI-sorted challenges automatically
        const res = await axios.get(
          "http://localhost:5000/api/challenges",
          config
        );
        // Filter out already joined challenges
        setChallenges(res.data.filter((c) => !c.isJoined));
      } else if (activeTab === "my-challenges") {
        const res = await axios.get(
          "http://localhost:5000/api/challenges/my-challenges",
          config
        );
        setChallenges(res.data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/challenges/stats",
        config
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      await axios.post(
        `http://localhost:5000/api/challenges/${challengeId}/join`,
        {},
        config
      );
      fetchChallenges();
      fetchStats();
      setActiveTab("my-challenges");
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert(err.response?.data?.msg || "Failed to join challenge");
    }
  };

  const updateProgress = async (challengeId, data) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.put(
        `http://localhost:5000/api/challenges/${challengeId}/progress`,
        data,
        config
      );

      alert(res.data.message);
      if (res.data.pointsEarned > 0) {
        alert(`🎉 You earned ${res.data.pointsEarned} points!`);
      }
      setProgressModal(null);
      fetchChallenges();
      fetchStats();
    } catch (err) {
      console.error("Error updating progress:", err);
      alert(err.response?.data?.msg || "Failed to update progress");
    }
  };

  const leaveChallenge = async (challengeId) => {
    if (!window.confirm("Are you sure you want to leave this challenge?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      await axios.delete(
        `http://localhost:5000/api/challenges/${challengeId}/leave`,
        config
      );
      fetchChallenges();
      fetchStats();
    } catch (err) {
      console.error("Error leaving challenge:", err);
      alert(err.response?.data?.msg || "Failed to leave challenge");
    }
  };

  const categories = [
    { value: "all", label: "All Categories", icon: "🎯" },
    { value: "health", label: "Health", icon: "💪" },
    { value: "wealth", label: "Wealth", icon: "💰" },
    { value: "financial", label: "Financial", icon: "📊" },
    { value: "insurance", label: "Insurance", icon: "🛡️" },
    { value: "aktivo", label: "Aktivo", icon: "⚡" },
    { value: "social", label: "Social", icon: "👥" },
  ];

  const types = [
    { value: "all", label: "All Types" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
    expert: "bg-purple-500",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading challenges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🎯 Challenges
          </h1>
          <p className="text-gray-600 text-lg">
            Take on challenges and earn rewards!
          </p>
          {/* Subtle AI indicator */}
          <p className="text-xs text-gray-400 mt-1">
            ✨ Personalized just for you
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalChallenges}
              </div>
              <div className="text-sm text-gray-500">Total Available</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeChallenges}
              </div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedChallenges}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.completedChallenges > 0
                  ? Math.round(
                      (stats.completedChallenges / stats.joinedChallenges) * 100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "available"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Challenges
          </button>
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "my-challenges"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("my-challenges")}
          >
            My Challenges ({stats?.activeChallenges || 0})
          </button>
        </div>

        {/* Filters */}
        {activeTab === "available" && (
          <>
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    filter === cat.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                  onClick={() => setFilter(cat.value)}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {types.map((type) => (
                <button
                  key={type.value}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    typeFilter === type.value
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setTypeFilter(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Challenges Grid - Now AI-sorted automatically */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "available" ? challenges : challenges)
            .map((item, index) => {
              const challenge =
                activeTab === "my-challenges" ? item.challenge : item;
              const progress = activeTab === "my-challenges" ? item : null;

              if (!challenge) return null;

              const progressPercentage = progress
                ? Math.round((progress.progress / progress.target) * 100)
                : 0;

              // Show a subtle "Recommended" badge only for top 3 AI picks
              const isTopRecommendation =
                activeTab === "available" && index < 3;

              return (
                <div
                  key={challenge._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative"
                >
                  {/* Subtle recommendation indicator */}
                  {isTopRecommendation && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Popular
                      </span>
                    </div>
                  )}

                  {/* Card Header */}
                  <div
                    className="p-6 relative"
                    style={{ background: challenge.color || "#667eea" }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-5xl drop-shadow-lg">
                        {challenge.icon || "🎯"}
                      </div>
                      <div
                        className={`${
                          difficultyColors[challenge.difficulty] ||
                          "bg-purple-500"
                        } text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}
                      >
                        {challenge.difficulty || "medium"}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {challenge.type || "daily"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {challenge.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-lg">🎯</span>
                        <span className="font-medium">
                          {challenge.target} {challenge.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-lg">📅</span>
                        <span className="font-medium capitalize">
                          {challenge.type}
                        </span>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">💎</span>
                        <span className="font-bold text-gray-800">
                          +{challenge.points} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">⭐</span>
                        <span className="font-bold text-gray-800">
                          +{challenge.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Progress or Join Button */}
                    {progress ? (
                      <div>
                        <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
                          <span>Progress</span>
                          <span>
                            {progress.progress}/{progress.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${progressPercentage}%`,
                              background: challenge.color || "#667eea",
                            }}
                          ></div>
                        </div>

                        {progress.status === "completed" ? (
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 rounded-xl font-bold">
                            ✓ Completed!
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setProgressModal({ challenge, progress })
                              }
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                              Update Progress
                            </button>
                            <button
                              onClick={() => leaveChallenge(challenge._id)}
                              className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                            >
                              Leave
                            </button>
                          </div>
                        )}

                        {progress.streak > 0 && (
                          <div className="mt-2 text-center text-sm text-orange-600 font-semibold">
                            🔥 {progress.streak} day streak!
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => joinChallenge(challenge._id)}
                      >
                        Join Challenge →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
            .filter(Boolean)}
        </div>

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4 opacity-20">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {activeTab === "available"
                ? "No challenges found"
                : "No active challenges"}
            </h3>
            <p className="text-gray-600">
              {activeTab === "available"
                ? "Try changing your filters or check back later!"
                : "Join some challenges to get started!"}
            </p>
          </div>
        )}

        {/* Progress Modal - Updated */}
        {progressModal && (
          <ChallengeProgress
            challenge={progressModal.challenge}
            progress={progressModal.progress}
            onUpdate={updateProgress}
            onClose={() => setProgressModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Challenges;
