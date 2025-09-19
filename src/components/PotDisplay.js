import React from 'react';

const PotDisplay = ({ pot }) => {
  const formatPot = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  return (
    <div className="pot-display">
      <div className="pot-label">Prize Pool</div>
      <div className="pot-amount">
        {formatPot(pot)}
        <span className="pot-currency">SOL</span>
      </div>
    </div>
  );
};

export default PotDisplay;