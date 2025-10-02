import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rewards.css';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  const fetchRewards = async () => {
    try {
      const response = await axios.get('/api/rewards');
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const claimReward = async (rewardId) => {
    try {
      await axios.post(`/api/rewards/claim/${rewardId}`);
      fetchRewards();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div className="rewards-container">
      <h2>Your Rewards</h2>
      <div className="rewards-grid">
        {rewards.map((reward) => (
          <div key={reward._id} className="reward-card">
            <img src={reward.icon} alt={reward.title} className="reward-icon" />
            <h3>{reward.title}</h3>
            <p>{reward.description}</p>
            <div className="reward-meta">
              <span>Points: {reward.points}</span>
              <span>Type: {reward.type}</span>
            </div>
            <button 
              className="claim-btn"
              onClick={() => claimReward(reward._id)}
            >
              Claim Reward
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;