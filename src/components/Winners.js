import React from 'react';

const Winners = ({ winners = {} }) => {
  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const getWinnerPlace = (position) => {
    switch(position) {
      case 0: return '🥇 1st';
      case 1: return '🥈 2nd';
      case 2: return '🥉 3rd';
      default: return `${position + 1}th`;
    }
  };

  return (
    <div className="winners-center">
      <h3>🏆 Winners by Round</h3>
      <div className="winners-center-content">
        {Object.keys(winners).length === 0 ? (
          <div className="no-winners">
            No winners yet
          </div>
        ) : (
          Object.entries(winners)
            .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort by round desc
            .slice(0, 2) // Show only last 2 rounds to save space
            .map(([round, roundWinners]) => (
              <div key={round} className="round-winners-compact">
                <h4 className="round-title">
                  Round {round}
                </h4>
                <div className="winners-grid">
                  {roundWinners && roundWinners.slice(0, 3).map((winner, index) => (
                    <div key={winner.txHash || index} className="winner-compact">
                      <div className="winner-place">
                        {getWinnerPlace(index)}
                      </div>
                      <div className="winner-details">
                        <div className="winner-amount-compact">
                          {formatAmount(winner.amount)} SOL
                        </div>
                        <div className="winner-wallet-compact">
                          {formatWallet(winner.wallet)}
                        </div>
                        {winner.prize && (
                          <div className="winner-prize">
                            Prize: {formatAmount(winner.prize)} SOL
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Winners;