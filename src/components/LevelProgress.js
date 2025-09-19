import React from 'react';
import { ROUND_1_LEVELS, ROUND_N_LEVELS } from '../utils/constants';

const LevelProgress = ({ currentRound, currentLevel, gameStartTime }) => {
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

  const levels = getLevels();
  const currentLevelIndex = getCurrentLevelIndex();

  return (
    <div className="level-progress">
      <h3>Level Requirements</h3>
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