import React, { useState, useEffect } from 'react';
import './Challenges.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // TODO: Fetch challenges from API
  }, []);

  return (
    <div className="challenges-container">
      <h2>Active Challenges</h2>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge._id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <div className="challenge-meta">
              <span>Points: {challenge.points}</span>
              <span>Type: {challenge.type}</span>
            </div>
            <button className="join-btn">Join Challenge</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;