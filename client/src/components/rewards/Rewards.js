import React, { useState, useEffect } from "react";
import axios from "axios";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [activeTab, setActiveTab] = useState("available");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
    fetchMyRewards();
  }, [filter]);

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
        params: filter !== "all" ? { category: filter } : {},
      };

      const res = await axios.get("http://localhost:5000/api/rewards", config);
      setRewards(res.data.rewards);
      setUserPoints(res.data.userPoints);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setLoading(false);
    }
  };

  const fetchMyRewards = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/rewards/my-rewards",
        config
      );
      setMyRewards(res.data);
    } catch (err) {
      console.error("Error fetching my rewards:", err);
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      await axios.post(
        `http://localhost:5000/api/rewards/${rewardId}/redeem`,
        {},
        config
      );
      alert("Reward redeemed successfully!");
      fetchRewards();
      fetchMyRewards();
      setActiveTab("redeemed");
    } catch (err) {
      console.error("Error redeeming reward:", err);
      alert(err.response?.data?.msg || "Failed to redeem reward");
    }
  };

  const categories = [
    { value: "all", label: "All Rewards", icon: "🎁" },
    { value: "health", label: "Health", icon: "💪" },
    { value: "wealth", label: "Wealth", icon: "💰" },
    { value: "insurance", label: "Insurance", icon: "🛡️" },
    { value: "lifestyle", label: "Lifestyle", icon: "✨" },
    { value: "premium", label: "Premium", icon: "👑" },
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🎁 Rewards Store
          </h1>
          <p className="text-gray-600 text-lg">
            Redeem your points for amazing rewards!
          </p>
        </div>

        {/* Points Display */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Points</p>
              <p className="text-4xl font-bold">{userPoints} 💎</p>
            </div>
            <div className="text-6xl">🏆</div>
          </div>
        </div>

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
            Available Rewards
          </button>
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "redeemed"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("redeemed")}
          >
            My Rewards ({myRewards.length})
          </button>
        </div>

        {activeTab === "available" && (
          <>
            {/* Category Filter */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    filter === cat.value
                      ? "bg-white text-purple-600 shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter(cat.value)}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
                    <div className="text-6xl mb-2">{reward.icon}</div>
                    <div className="text-white text-sm font-semibold uppercase tracking-wide">
                      {reward.type}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {reward.description}
                    </p>

                    {reward.partnerName && (
                      <p className="text-xs text-gray-500 mb-4">
                        Partner: {reward.partnerName}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {reward.pointsCost} 💎
                      </div>
                      {reward.value && (
                        <div className="text-sm text-gray-500">
                          Worth ${reward.value}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => redeemReward(reward._id)}
                      disabled={
                        userPoints < reward.pointsCost ||
                        (reward.stockAvailable !== -1 &&
                          reward.stockAvailable <= 0)
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {userPoints < reward.pointsCost
                        ? "Not Enough Points"
                        : "Redeem Now"}
                    </button>

                    {reward.stockAvailable !== -1 && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {reward.stockAvailable} left in stock
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "redeemed" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRewards.map((userReward) => (
              <div
                key={userReward._id}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{userReward.reward.icon}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      userReward.status === "active"
                        ? "bg-green-100 text-green-600"
                        : userReward.status === "used"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {userReward.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {userReward.reward.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {userReward.reward.description}
                </p>

                {userReward.code && (
                  <div className="bg-gray-100 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Redemption Code:
                    </p>
                    <p className="text-lg font-mono font-bold text-purple-600">
                      {userReward.code}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Expires: {new Date(userReward.expiresAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {myRewards.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4 opacity-20">🎁</div>
                <p className="text-gray-500">No redeemed rewards yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
