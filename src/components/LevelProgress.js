import React, { useState, useEffect } from 'react';
import { ROUND_1_LEVELS, ROUND_N_LEVELS } from '../utils/constants';

const LevelProgress = ({ currentRound, currentLevel, gameStartTime, isActive, currentLevelStartTime }) => {
  const [timeToNextLevel, setTimeToNextLevel] = useState(null);

  const getLevels = () => {
    return currentRound === 1 ? ROUND_1_LEVELS : ROUND_N_LEVELS;
  };

  const getCurrentLevelIndex = () => {
    if (!isActive || !gameStartTime) {
      return 0; // If game hasn't started, we're at level 1 (index 0)
    }

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
    let currentLevelIndex;

    if (!isActive || !gameStartTime) {
      // Game hasn't started yet, show countdown to Level 2
      currentLevelIndex = 0;
      return levels[0].duration * 60 * 60 * 1000; // Show full duration of Level 1
    }

    currentLevelIndex = getCurrentLevelIndex();
    
    // If we're at the last level (infinite duration), no next level
    if (currentLevelIndex >= levels.length - 1 || levels[currentLevelIndex].duration === Infinity) {
      return null;
    }

    // Use currentLevelStartTime if available, otherwise fallback to calculation
    if (currentLevelStartTime) {
      const currentLevelDuration = levels[currentLevelIndex].duration * 60 * 60 * 1000;
      const elapsed = Date.now() - currentLevelStartTime;
      const timeRemaining = currentLevelDuration - elapsed;
      return Math.max(0, timeRemaining);
    }

    // Fallback: Calculate when the next level starts based on game start time
    let totalTimeToNextLevel = 0;
    for (let i = 0; i <= currentLevelIndex; i++) {
      totalTimeToNextLevel += levels[i].duration * 60 * 60 * 1000;
    }
    
    const elapsed = Date.now() - gameStartTime;
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

  const getNextLevelNumber = () => {
    const currentLevelIndex = getCurrentLevelIndex();
    return currentLevelIndex + 2; // +1 for next level, +1 because levels start at 1
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
  }, [gameStartTime, currentRound, isActive, currentLevelStartTime]);

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
            {!isActive ? 'Level 1 Duration:' : `Level ${getNextLevelNumber()} in:`}
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