import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const [userRes, achievementsRes, activitiesRes, rewardsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/users/me", config),
          axios.get("http://localhost:5000/api/achievements", config),
          axios.get("http://localhost:5000/api/activities", config),
          axios.get("http://localhost:5000/api/rewards/my-rewards", config),
        ]);

      setStats(userRes.data);
      setAchievements(achievementsRes.data);
      setActivities(activitiesRes.data.slice(0, 10));
      setMyRewards(rewardsRes.data.slice(0, 5));

      setFormData({
        firstName: userRes.data.profile?.firstName || "",
        lastName: userRes.data.profile?.lastName || "",
        bio: userRes.data.profile?.bio || "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      await axios.put(
        "http://localhost:5000/api/users/profile",
        { profile: formData },
        config
      );
      setEditMode(false);
      fetchProfileData();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const levelProgress = stats ? ((stats.xp % 1000) / 1000) * 100 : 0;
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Cover Banner */}
          <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-5xl font-bold border-8 border-white shadow-2xl">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : user?.username}
                </h1>
                <p className="text-gray-500 mb-2">@{user?.username}</p>
                {formData.bio && (
                  <p className="text-gray-600 max-w-2xl">{formData.bio}</p>
                )}
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Edit Mode */}
            {editMode && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-purple-900">
                  Level {stats?.level || 1}
                </div>
                <div className="text-xs text-purple-700">Current Level</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-2xl font-bold text-blue-900">
                  {stats?.points || 0}
                </div>
                <div className="text-xs text-blue-700">Total Points</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-orange-900">
                  {stats?.streak?.current || 0}
                </div>
                <div className="text-xs text-orange-700">Day Streak</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-900">
                  {stats?.stats?.challengesCompleted || 0}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">
                  Level Progress
                </span>
                <span className="text-sm text-gray-500">
                  {stats?.xp % 1000}/1000 XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.floor(1000 - (stats?.xp % 1000))} XP until Level{" "}
                {(stats?.level || 1) + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏆 Achievements
          </h2>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Unlocked ({unlockedAchievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border-2 border-yellow-300 hover:scale-105 transition-transform"
                  >
                    <div className="text-5xl mb-2">{achievement.icon}</div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {achievement.description}
                    </p>
                    <div className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      +{achievement.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Locked ({lockedAchievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="bg-gray-100 rounded-2xl p-4 text-center opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-5xl mb-2 grayscale">
                      {achievement.icon}
                    </div>
                    <h4 className="font-bold text-gray-600 text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {achievement.description}
                    </p>
                    <div className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      🔒 Locked
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* My Rewards */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🎁 My Rewards
            </h2>
            {myRewards.length > 0 ? (
              <div className="space-y-4">
                {myRewards.map((userReward) => (
                  <div
                    key={userReward._id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{userReward.reward.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {userReward.reward.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {userReward.reward.description}
                          </p>
                        </div>
                      </div>
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
                    {userReward.code && (
                      <div className="bg-white p-2 rounded-lg mt-2">
                        <p className="text-xs text-gray-500">Code:</p>
                        <p className="font-mono font-bold text-purple-600">
                          {userReward.code}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No rewards redeemed yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
