import React from 'react';
import moment from 'moment';

const Winners = ({ winners = {} }) => {
  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const getWinnerPercentage = (position) => {
    switch(position) {
      case 0: return '70%'; // 1st place
      case 1: return '20%'; // 2nd place  
      case 2: return '10%'; // 3rd place
      default: return '0%';
    }
  };

  const getWinnerPlace = (position) => {
    switch(position) {
      case 0: return '🥇 1st';
      case 1: return '🥈 2nd';
      case 2: return '🥉 3rd';
      default: return `${position + 1}th`;
    }
  };

  const openSolscanLink = (txHash) => {
    if (txHash && !txHash.includes('simulated')) {
      const url = `https://solscan.io/tx/${txHash}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatTxHash = (txHash) => {
    if (!txHash) return 'N/A';
    if (txHash.includes('simulated')) return 'Simulated';
    return `${txHash.slice(0, 8)}...`;
  };

  const isTxClickable = (txHash) => {
    return txHash && !txHash.includes('simulated');
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