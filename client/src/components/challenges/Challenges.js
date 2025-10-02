import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Challenges.css";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, [filter]);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
        params: filter !== "all" ? { category: filter } : {},
      };

      const res = await axios.get(
        "http://localhost:5000/api/challenges",
        config
      );
      setChallenges(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setLoading(false);
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
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert(err.response?.data?.msg || "Failed to join challenge");
    }
  };

  const categories = [
    { value: "all", label: "All Challenges", icon: "🎯" },
    { value: "health", label: "Health", icon: "💪" },
    { value: "wealth", label: "Wealth", icon: "💰" },
    { value: "financial", label: "Financial", icon: "📊" },
    { value: "insurance", label: "Insurance", icon: "🛡️" },
    { value: "aktivo", label: "Aktivo", icon: "⚡" },
    { value: "social", label: "Social", icon: "👥" },
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
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Card Header */}
              <div
                className="p-6 relative"
                style={{ background: challenge.color || "#667eea" }}
              >
                <div className="flex justify-between items-start">
                  <div className="text-5xl drop-shadow-lg">
                    {challenge.icon}
                  </div>
                  <div
                    className={`${
                      difficultyColors[challenge.difficulty]
                    } text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}
                  >
                    {challenge.difficulty}
                  </div>
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
                {challenge.userProgress ? (
                  <div>
                    <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
                      <span>Progress</span>
                      <span>
                        {challenge.userProgress.progress}/{challenge.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (challenge.userProgress.progress /
                              challenge.target) *
                            100
                          }%`,
                          background: challenge.color || "#667eea",
                        }}
                      ></div>
                    </div>
                    {challenge.userProgress.status === "completed" && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 rounded-xl font-bold">
                        ✓ Completed!
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
          ))}
        </div>

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4 opacity-20">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No challenges found
            </h3>
            <p className="text-gray-600">
              Check back later for new challenges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
