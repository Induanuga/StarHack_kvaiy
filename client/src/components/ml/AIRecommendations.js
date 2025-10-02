import React, { useState, useEffect } from "react";
import axios from "axios";

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
    fetchInsights();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/ml/recommendations",
        config
      );
      setRecommendations(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/ml/behavior-insights",
        config
      );
      setInsights(res.data);
    } catch (err) {
      console.error("Error fetching insights:", err);
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
      alert("Challenge joined successfully!");
      fetchRecommendations();
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert(err.response?.data?.msg || "Failed to join challenge");
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🤖 AI Recommendations
          </h1>
          <p className="text-gray-600 text-lg">
            Personalized challenges powered by machine learning
          </p>
        </div>

        {/* Behavior Insights */}
        {insights?.hasData && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Your Activity Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-blue-900">
                  {insights.insights.totalChallenges}
                </div>
                <div className="text-sm text-blue-700">Total Challenges</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-green-900">
                  {Math.round(insights.insights.completionRate)}%
                </div>
                <div className="text-sm text-green-700">Success Rate</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-purple-900">
                  {insights.insights.avgTimeToComplete}d
                </div>
                <div className="text-sm text-purple-700">Avg. Completion</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-sm font-bold text-orange-900 uppercase">
                  {insights.insights.preferredCategories[0]}
                </div>
                <div className="text-sm text-orange-700">Top Category</div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎯 Recommended For You
          </h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((challenge) => (
                <div
                  key={challenge._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Confidence Badge */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-4xl">{challenge.icon}</span>
                      <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        <span className="font-bold">
                          {challenge.confidence}%
                        </span>
                        <span className="text-xs ml-1">Match</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{challenge.title}</h3>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3">
                      {challenge.description}
                    </p>

                    {/* AI Reason */}
                    <div className="bg-blue-50 rounded-xl p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🤖</span>
                        <div>
                          <p className="text-xs font-semibold text-blue-800 mb-1">
                            Why we recommend this:
                          </p>
                          <p className="text-xs text-blue-700">
                            {challenge.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Challenge Details */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>🎯</span>
                        <span>
                          {challenge.target} {challenge.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⏰</span>
                        <span className="capitalize">{challenge.type}</span>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-600">Points</div>
                        <div className="font-bold text-orange-600">
                          +{challenge.points}
                        </div>
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-600">XP</div>
                        <div className="font-bold text-blue-600">
                          +{challenge.xpReward}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => joinChallenge(challenge._id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Join Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Building Your Profile
              </h3>
              <p className="text-gray-600">
                Complete more challenges to get personalized recommendations!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
