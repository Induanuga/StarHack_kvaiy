import React, { useState } from "react";

const ChallengeProgress = ({ challenge, progress, onUpdate, onClose }) => {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const activityOptions = {
    health: [
      {
        value: "steps",
        label: "Steps Walked",
        icon: "👣",
        unit: "steps",
        max: 20000,
      },
      {
        value: "workout",
        label: "Workout Session",
        icon: "💪",
        unit: "session",
        max: 3,
      },
      {
        value: "water",
        label: "Water Intake",
        icon: "💧",
        unit: "glasses",
        max: 5,
      },
      {
        value: "sleep",
        label: "Sleep Hours",
        icon: "😴",
        unit: "hours",
        max: 12,
      },
      {
        value: "meditation",
        label: "Meditation",
        icon: "🧘",
        unit: "minutes",
        max: 120,
      },
    ],
    wealth: [
      {
        value: "savings",
        label: "Money Saved",
        icon: "💰",
        unit: "dollars",
        max: 1000,
      },
      {
        value: "investment",
        label: "Investment Made",
        icon: "📈",
        unit: "dollars",
        max: 5000,
      },
      {
        value: "budget_log",
        label: "Budget Entry",
        icon: "📊",
        unit: "entry",
        max: 1,
      },
    ],
    financial: [
      {
        value: "expense_log",
        label: "Expense Logged",
        icon: "💳",
        unit: "entry",
        max: 1,
      },
      {
        value: "budget_review",
        label: "Budget Reviewed",
        icon: "📋",
        unit: "review",
        max: 1,
      },
      {
        value: "debt_payment",
        label: "Debt Payment",
        icon: "💸",
        unit: "dollars",
        max: 1000,
      },
    ],
    insurance: [
      {
        value: "policy_review",
        label: "Policy Reviewed",
        icon: "🛡️",
        unit: "review",
        max: 1,
      },
      {
        value: "document_upload",
        label: "Document Uploaded",
        icon: "📄",
        unit: "document",
        max: 5,
      },
      {
        value: "claim_filed",
        label: "Claim Filed",
        icon: "📝",
        unit: "claim",
        max: 1,
      },
    ],
    aktivo: [
      {
        value: "health_score",
        label: "Health Score Points",
        icon: "⚡",
        unit: "points",
        max: 100,
      },
      {
        value: "activity_completed",
        label: "Activity Completed",
        icon: "✅",
        unit: "activity",
        max: 10,
      },
    ],
    social: [
      {
        value: "share",
        label: "Shared with Friends",
        icon: "👥",
        unit: "share",
        max: 10,
      },
      {
        value: "family_activity",
        label: "Family Activity",
        icon: "👨‍👩‍👧‍👦",
        unit: "session",
        max: 3,
      },
      {
        value: "group_challenge",
        label: "Group Challenge",
        icon: "🤝",
        unit: "challenge",
        max: 1,
      },
    ],
  };

  const activities = activityOptions[challenge.category] || [];
  const selectedActivityData = activities.find(
    (a) => a.value === selectedActivity
  );

  const handleSubmit = async () => {
    if (!selectedActivity || !amount) {
      alert("Please select an activity and enter an amount");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (selectedActivityData && numAmount > selectedActivityData.max) {
      alert(
        `Maximum allowed: ${selectedActivityData.max} ${selectedActivityData.unit}`
      );
      return;
    }

    setLoading(true);
    try {
      await onUpdate(challenge._id, {
        amount: numAmount,
        activityType: selectedActivity,
        action: "increment",
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
        <p className="text-gray-600 mb-4">
          Current Progress: {progress.progress}/{progress.target}{" "}
          {challenge.unit}
        </p>

        {/* Activity Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Activity Type
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {activities.map((activity) => (
              <button
                key={activity.value}
                onClick={() => {
                  setSelectedActivity(activity.value);
                  setAmount("");
                }}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedActivity === activity.value
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <div className="font-semibold">{activity.label}</div>
                    <div className="text-xs opacity-75">
                      Max: {activity.max} {activity.unit}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        {selectedActivity && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Amount ({selectedActivityData?.unit})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`Max: ${selectedActivityData?.max}`}
              min="0"
              max={selectedActivityData?.max}
              step="any"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedActivity || !amount}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Log Activity"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Your activities are verified to ensure fair
            play. Unrealistic entries will be rejected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeProgress;
