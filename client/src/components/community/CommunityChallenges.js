import React, { useState, useEffect } from "react";
import axios from "axios";

const CommunityChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contributeModal, setContributeModal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/community/challenges",
        config
      );
      setChallenges(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching community challenges:", err);
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
        `http://localhost:5000/api/community/challenges/${challengeId}/join`,
        {},
        config
      );
      alert("Joined community challenge!");
      fetchChallenges();
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert(err.response?.data?.msg || "Failed to join challenge");
    }
  };

  const contribute = async (challengeId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const amount = parseFloat(contributeAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/community/challenges/${challengeId}/contribute`,
        { amount },
        config
      );

      alert(res.data.message);
      setContributeModal(null);
      setContributeAmount("");
      fetchChallenges();
    } catch (err) {
      console.error("Error contributing:", err);
      alert(err.response?.data?.msg || "Failed to contribute");
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
            👥 Community Challenges
          </h1>
          <p className="text-gray-600 text-lg">
            Join forces with others to achieve collective wellness goals!
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-6 text-white relative"
                style={{
                  background:
                    challenge.color ||
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">{challenge.icon}</div>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <div className="text-sm font-semibold">
                      {challenge.participantCount} participants
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
                <p className="text-white text-opacity-90">
                  {challenge.description}
                </p>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">
                      Community Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {challenge.currentProgress.toLocaleString()}/
                      {challenge.goal.toLocaleString()} {challenge.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                    <div
                      className="h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                      style={{
                        width: `${challenge.progressPercentage}%`,
                        background:
                          challenge.color ||
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {challenge.progressPercentage}%
                    </div>
                  </div>
                </div>

                {/* User Contribution */}
                {challenge.isParticipating && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Your Contribution
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {challenge.userContribution.toLocaleString()}{" "}
                          {challenge.unit}
                        </p>
                      </div>
                      <div className="text-4xl">🎖️</div>
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {challenge.milestones && challenge.milestones.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">
                      Milestones
                    </p>
                    <div className="space-y-2">
                      {challenge.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            milestone.reached
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="text-2xl">
                            {milestone.reached ? "✅" : "⭕"}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {milestone.threshold.toLocaleString()}{" "}
                              {challenge.unit}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            +{milestone.bonus} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Completion Rewards
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💎</span>
                      <span className="font-bold text-orange-600">
                        +{challenge.rewards.points} pts
                      </span>
                    </div>
                    {challenge.rewards.badge && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏅</span>
                        <span className="font-bold text-purple-600">
                          {challenge.rewards.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {challenge.status === "completed" ? (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-4 rounded-xl font-bold text-lg">
                    🎉 Completed!
                  </div>
                ) : challenge.isParticipating ? (
                  <button
                    onClick={() => setContributeModal(challenge)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
                  >
                    Contribute More
                  </button>
                ) : (
                  <button
                    onClick={() => joinChallenge(challenge._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
                  >
                    Join Community
                  </button>
                )}

                {/* Time Remaining */}
                <p className="text-center text-sm text-gray-500 mt-3">
                  Ends: {new Date(challenge.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl">
            <div className="text-8xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Active Community Challenges
            </h3>
            <p className="text-gray-600">
              Check back soon for new community goals!
            </p>
          </div>
        )}

        {/* Contribute Modal */}
        {contributeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">
                Contribute to Challenge
              </h3>
              <p className="text-gray-600 mb-4">{contributeModal.title}</p>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Amount ({contributeModal.unit})
                </label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`e.g., 100 ${contributeModal.unit}`}
                  min="0"
                  step="any"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => contribute(contributeModal._id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Contribute
                </button>
                <button
                  onClick={() => {
                    setContributeModal(null);
                    setContributeAmount("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityChallenges;
