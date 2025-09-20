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
    <div className="winners-panel">
      <h3>🏆 Winners by Round</h3>
      <div className="winners-list">
        {Object.keys(winners).length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.5)', 
            padding: '2rem'
          }}>
            No winners yet
          </div>
        ) : (
          Object.entries(winners)
            .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort by round desc
            .map(([round, roundWinners]) => (
              <div key={round} className="round-winners">
                <h4 style={{ 
                  color: '#ff00ff', 
                  marginBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 0, 255, 0.3)',
                  paddingBottom: '0.5rem'
                }}>
                  Round {round}
                </h4>
                {roundWinners && roundWinners.map((winner, index) => (
                  <div key={winner.txHash || index} className="winner-item">
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                        {getWinnerPlace(index)}
                      </span>
                      <span style={{ color: '#00ff00' }}>
                        {getWinnerPercentage(index)}
                      </span>
                    </div>
                    <div className="winner-amount">
                      {formatAmount(winner.amount)} SOL
                    </div>
                    <div className="winner-wallet">
                      {formatWallet(winner.wallet)}
                    </div>
                    <div className="winner-time">
                      {moment(winner.timestamp).format('MM/DD HH:mm:ss')}
                    </div>
                    <div 
                      className={`winner-tx ${isTxClickable(winner.txHash) ? 'clickable' : ''}`}
                      onClick={() => isTxClickable(winner.txHash) && openSolscanLink(winner.txHash)}
                      style={{
                        cursor: isTxClickable(winner.txHash) ? 'pointer' : 'default',
                        opacity: isTxClickable(winner.txHash) ? 1 : 0.6
                      }}
                      title={isTxClickable(winner.txHash) ? 'Click to view on Solscan' : 'Transaction not available on explorer'}
                    >
                      TX: {formatTxHash(winner.txHash)}
                      {isTxClickable(winner.txHash) && (
                        <span style={{ 
                          marginLeft: '0.5rem', 
                          fontSize: '0.6rem',
                          opacity: 0.8
                        }}>
                          🔗
                        </span>
                      )}
                    </div>
                    {winner.prize && (
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#00ff88',
                        fontWeight: 'bold',
                        marginTop: '0.5rem'
                      }}>
                        Prize: {formatAmount(winner.prize)} SOL
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Winners;