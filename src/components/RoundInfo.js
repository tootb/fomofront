import React from 'react';

const RoundInfo = ({ currentRound, currentLevel }) => {
  return (
    <div className="round-info">
      <div className="round-number">
        Round {currentRound}
      </div>
      <div className="level-info">
        Level {currentLevel}
      </div>
    </div>
  );
};

export default RoundInfo;