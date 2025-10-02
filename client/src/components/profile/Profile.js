import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    healthScore: 0,
    wealthScore: 0,
    level: 1,
    achievements: []
  });

  useEffect(() => {
    // TODO: Fetch profile data from API
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{profile.name}'s Profile</h2>
        <div className="profile-stats">
          <div className="stat">
            <label>Health Score</label>
            <span>{profile.healthScore}</span>
          </div>
          <div className="stat">
            <label>Wealth Score</label>
            <span>{profile.wealthScore}</span>
          </div>
          <div className="stat">
            <label>Level</label>
            <span>{profile.level}</span>
          </div>
        </div>
      </div>
      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {profile.achievements.map((achievement) => (
            <div key={achievement._id} className="achievement-card">
              <img src={achievement.icon} alt={achievement.title} />
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;