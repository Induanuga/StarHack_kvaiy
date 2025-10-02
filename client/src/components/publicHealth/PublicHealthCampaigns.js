import React, { useState, useEffect } from "react";
import axios from "axios";

const PublicHealthCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        "http://localhost:5000/api/public-health/campaigns",
        config
      );
      setCampaigns(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const region = prompt(
        "Enter your region (e.g., North, South, East, West):"
      );
      await axios.post(
        `http://localhost:5000/api/public-health/campaigns/${campaignId}/join`,
        { region },
        config
      );

      alert("Joined campaign successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error("Error joining campaign:", err);
      alert(err.response?.data?.msg || "Failed to join campaign");
    }
  };

  const viewImpact = async (campaignId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const res = await axios.get(
        `http://localhost:5000/api/public-health/campaigns/${campaignId}/impact`,
        config
      );

      setImpactData(res.data);
      setSelectedCampaign(campaigns.find((c) => c._id === campaignId));
    } catch (err) {
      console.error("Error fetching impact:", err);
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
            🏥 Public Health Campaigns
          </h1>
          <p className="text-gray-600 text-lg">
            Join nationwide health initiatives and make a real impact!
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-6 text-white relative"
                style={{
                  background:
                    campaign.color ||
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-6xl">{campaign.icon}</div>
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold">
                      {campaign.sponsor.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
                <p className="text-white text-opacity-90 text-sm">
                  {campaign.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <span>{campaign.sponsor.logo}</span>
                  <span>{campaign.sponsor.name}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Goals Progress */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Campaign Goals
                  </h3>
                  {campaign.goals.map((goal, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{goal.metric}</span>
                        <span className="font-semibold">
                          {goal.current.toLocaleString()}/
                          {goal.target.toLocaleString()} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (goal.current / goal.target) * 100,
                              100
                            )}%`,
                            background: campaign.color || "#667eea",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {campaign.totalParticipants.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Participants</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(campaign.overallProgress)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      Overall Progress
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Your Rewards
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💎</span>
                      <span className="font-bold text-orange-600">
                        +{campaign.rewards.individual.points} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏅</span>
                      <span className="font-bold text-purple-600 text-sm">
                        {campaign.rewards.individual.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {campaign.isParticipating ? (
                    <>
                      <button
                        onClick={() => viewImpact(campaign._id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        View Impact
                      </button>
                      <div className="flex-1 bg-green-100 text-green-600 py-3 rounded-xl font-semibold text-center">
                        ✓ Participating
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => joinCampaign(campaign._id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Join Campaign
                    </button>
                  )}
                </div>

                {/* Dates */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                  {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Modal */}
        {impactData && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">
                Campaign Impact: {selectedCampaign.title}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {impactData.peopleReached.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">People Reached</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-green-600">
                    {impactData.goalsAchieved}/{impactData.totalGoals}
                  </div>
                  <div className="text-xs text-gray-600">Goals Achieved</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${(impactData.estimatedCostSavings / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-600">Cost Savings</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Health Outcomes</h4>
                <p className="text-gray-600 bg-green-50 p-4 rounded-xl">
                  {impactData.healthOutcomes}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Regional Breakdown</h4>
                {impactData.regions.map((region, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{region.name}</span>
                      <span>{region.participants} participants</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(region.progress / 1000, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setImpactData(null);
                  setSelectedCampaign(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHealthCampaigns;
