import React, { useState, useEffect } from 'react';
import { ROUND_1_LEVELS, ROUND_N_LEVELS } from '../utils/constants';

const LevelProgress = ({ currentRound, currentLevel, gameStartTime }) => {
  const [timeToNextLevel, setTimeToNextLevel] = useState(null);

  const getLevels = () => {
    return currentRound === 1 ? ROUND_1_LEVELS : ROUND_N_LEVELS;
  };

  const getCurrentLevelIndex = () => {
    const levels = getLevels();
    const elapsed = Date.now() - gameStartTime;
    let totalTime = 0;
    
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].duration === Infinity) {
        return i;
      }
      totalTime += levels[i].duration * 60 * 60 * 1000; // Convert hours to ms
      if (elapsed < totalTime) {
        return i;
      }
    }
    return levels.length - 1;
  };

  const calculateTimeToNextLevel = () => {
    const levels = getLevels();
    const currentLevelIndex = getCurrentLevelIndex();
    const elapsed = Date.now() - gameStartTime;
    
    // If we're at the last level (infinite duration), no next level
    if (currentLevelIndex >= levels.length - 1 || levels[currentLevelIndex].duration === Infinity) {
      return null;
    }
    
    // Calculate when the next level starts
    let totalTimeToNextLevel = 0;
    for (let i = 0; i <= currentLevelIndex; i++) {
      totalTimeToNextLevel += levels[i].duration * 60 * 60 * 1000;
    }
    
    const timeRemaining = totalTimeToNextLevel - elapsed;
    return Math.max(0, timeRemaining);
  };

  const formatCountdown = (milliseconds) => {
    if (!milliseconds) return null;
    
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const timeRemaining = calculateTimeToNextLevel();
      setTimeToNextLevel(timeRemaining);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, currentRound]);

  const levels = getLevels();
  const currentLevelIndex = getCurrentLevelIndex();

  return (
    <div className="level-progress">
      <h3>Level Requirements</h3>
      
      {/* Next Level Countdown */}
      {timeToNextLevel !== null && timeToNextLevel > 0 && (
        <div className="next-level-countdown" style={{
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid #ffa500',
          borderRadius: '10px',
          padding: '0.8rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            color: '#ffa500', 
            fontSize: '0.9rem',
            marginBottom: '0.3rem',
            fontWeight: 'bold'
          }}>
            Next Level in:
          </div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '1.1rem',
            fontWeight: '900',
            fontFamily: 'Orbitron, monospace',
            textShadow: '0 0 10px rgba(255, 165, 0, 0.5)'
          }}>
            {formatCountdown(timeToNextLevel)}
          </div>
        </div>
      )}

      {/* Level List */}
      {levels.map((level, index) => (
        <div 
          key={index} 
          className={`level-item ${
            index === currentLevelIndex ? 'active' : 
            index < currentLevelIndex ? 'completed' : ''
          }`}
        >
          <span>Level {index + 1}</span>
          <span>{level.requirement} SOL</span>
          <span>{level.duration === Infinity ? '∞' : level.duration + 'h'}</span>
        </div>
      ))}
    </div>
  );
};

export default LevelProgress;