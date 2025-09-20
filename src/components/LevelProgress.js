import React, { useState, useEffect } from 'react';
import { ROUND_1_LEVELS, ROUND_N_LEVELS } from '../utils/constants';

const LevelProgress = ({ currentRound, currentLevel, gameStartTime, isActive, currentLevelStartTime }) => {
  const [timeToNextLevel, setTimeToNextLevel] = useState(null);

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
    const getLevels = () => {
      return currentRound === 1 ? ROUND_1_LEVELS : ROUND_N_LEVELS;
    };

    const getCurrentLevelIndex = () => {
      if (!isActive || !gameStartTime) {
        return 0;
      }

      const levels = getLevels();
      const elapsed = Date.now() - gameStartTime;
      let totalTime = 0;
      
      for (let i = 0; i < levels.length; i++) {
        if (levels[i].duration === Infinity) {
          return i;
        }
        totalTime += levels[i].duration * 60 * 60 * 1000;
        if (elapsed < totalTime) {
          return i;
        }
      }
      return levels.length - 1;
    };

    const calculateTimeToNextLevel = () => {
      const levels = getLevels();
      
      if (!isActive || !gameStartTime) {
        const level1Duration = levels[0].duration * 60 * 60 * 1000;
        return level1Duration;
      }

      const currentLevelIndex = getCurrentLevelIndex();
      
      if (currentLevelIndex >= levels.length - 1 || levels[currentLevelIndex].duration === Infinity) {
        return null;
      }

      const currentLevelDuration = levels[currentLevelIndex].duration * 60 * 60 * 1000;

      if (currentLevelStartTime) {
        const elapsed = Date.now() - currentLevelStartTime;
        const timeRemaining = currentLevelDuration - elapsed;
        return Math.max(0, timeRemaining);
      }

      const gameElapsed = Date.now() - gameStartTime;
      let totalTimeForCurrentLevel = 0;
      
      for (let i = 0; i < currentLevelIndex; i++) {
        totalTimeForCurrentLevel += levels[i].duration * 60 * 60 * 1000;
      }
      
      const elapsedInCurrentLevel = gameElapsed - totalTimeForCurrentLevel;
      const timeRemaining = currentLevelDuration - elapsedInCurrentLevel;
      
      return Math.max(0, timeRemaining);
    };

    const updateCountdown = () => {
      const timeRemaining = calculateTimeToNextLevel();
      setTimeToNextLevel(timeRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, currentRound, isActive, currentLevelStartTime, currentLevel]);

  const levels = currentRound === 1 ? ROUND_1_LEVELS : ROUND_N_LEVELS;
  const currentLevelIndex = currentLevel - 1;

  const getNextLevelNumber = () => {
    if (!isActive || !gameStartTime) {
      return 1;
    }

    const elapsed = Date.now() - gameStartTime;
    let totalTime = 0;
    
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].duration === Infinity) {
        return i + 2;
      }
      totalTime += levels[i].duration * 60 * 60 * 1000;
      if (elapsed < totalTime) {
        return i + 2;
      }
    }
    return levels.length;
  };

  return (
    <div className="level-progress">
      <h3>Level Requirements</h3>
      
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