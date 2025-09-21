import React from 'react';

const Winners = ({ winners = {} }) => {
  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const getWinnerPlace = (position) => {
    switch(position) {
      case 1: return '🥇 1st';
      case 2: return '🥈 2nd';
      case 3: return '🥉 3rd';
      default: return `${position}th`;
    }
  };

  const openSolscanLink = (txHash) => {
    if (txHash && !txHash.includes('simulated') && txHash !== 'unknown') {
      const url = `https://solscan.io/tx/${txHash}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatTxHash = (txHash) => {
    if (!txHash || txHash === 'unknown') return 'N/A';
    if (txHash.includes('simulated')) return 'Simulated';
    return `${txHash.slice(0, 8)}...`;
  };

  const isTxClickable = (txHash) => {
    return txHash && !txHash.includes('simulated') && txHash !== 'unknown';
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
                        {getWinnerPlace(winner.place || (index + 1))}
                      </div>
                      <div className="winner-details">
                        <div className="winner-amount-compact">
                          {formatAmount(winner.amount)} SOL
                        </div>
                        {winner.prize && (
                          <div className="winner-prize">
                            Prize: {formatAmount(winner.prize)} SOL ({winner.percentage}%)
                          </div>
                        )}
                        <div 
                          className={`winner-tx ${isTxClickable(winner.txHash) ? 'clickable' : ''}`}
                          onClick={() => isTxClickable(winner.txHash) && openSolscanLink(winner.txHash)}
                          style={{
                            cursor: isTxClickable(winner.txHash) ? 'pointer' : 'default',
                            opacity: isTxClickable(winner.txHash) ? 1 : 0.6,
                            fontSize: '0.7rem',
                            color: isTxClickable(winner.txHash) ? '#00ffff' : '#888',
                            marginTop: '0.2rem'
                          }}
                          title={isTxClickable(winner.txHash) ? 'Click to view winning transaction on Solscan' : 'Transaction not available on explorer'}
                        >
                          TX: {formatTxHash(winner.txHash)}
                          {isTxClickable(winner.txHash) && (
                            <span style={{ 
                              marginLeft: '0.3rem', 
                              fontSize: '0.6rem'
                            }}>
                              🔗
                            </span>
                          )}
                        </div>
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