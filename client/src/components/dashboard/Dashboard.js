import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    healthScore: 0,
    wealthScore: 0,
    level: 1,
    dailyTasks: [],
    achievements: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/users/dashboard');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Wellness Journey</h2>
        <div className="user-stats">
          <div className="stat-card">
            <h3>Health Score</h3>
            <p>{userData.healthScore}</p>
          </div>
          <div className="stat-card">
            <h3>Wealth Score</h3>
            <p>{userData.wealthScore}</p>
          </div>
          <div className="stat-card">
            <h3>Level</h3>
            <p>{userData.level}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="daily-challenges">
          <h3>Daily Challenges</h3>
          <div className="challenge-list">
            {userData.dailyTasks.map((task, index) => (
              <div key={index} className="challenge-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <button className="complete-btn">Complete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements">
          <h3>Recent Achievements</h3>
          <div className="achievement-list">
            {userData.achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <img src={achievement.icon} alt={achievement.title} />
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;