import React from 'react';
import moment from 'moment';

const RecentBuys = ({ buys }) => {
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const getTransactionIcon = (type) => {
    return type === 'buy' ? '🟢' : '🔴';
  };

  const getTransactionLabel = (type) => {
    return type === 'buy' ? 'BUY' : 'SELL';
  };

  const getTransactionColor = (type) => {
    return type === 'buy' ? '#00ff88' : '#ff4757';
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
    <div className="recent-buys">
      <h3>Recent Transactions (Last 50)</h3>
      <div className="buys-list">
        {!buys || buys.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.5)', 
            padding: '2rem' 
          }}>
            No transactions yet
          </div>
        ) : (
          buys.map((transaction, index) => (
            <div key={transaction.txHash || transaction._id || index} className="buy-item">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ 
                  color: getTransactionColor(transaction.type),
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {getTransactionIcon(transaction.type)} {getTransactionLabel(transaction.type)}
                </span>
                <span style={{ color: '#ffd700', fontSize: '0.8rem' }}>
                  Round {transaction.round}
                </span>
              </div>
              
              <div className="buy-amount">
                {formatAmount(transaction.amount)} SOL
              </div>
              
              <div className="buy-time">
                {moment(transaction.timestamp).format('HH:mm:ss')}
              </div>
              
              <div 
                className={`buy-tx ${isTxClickable(transaction.txHash) ? 'clickable' : ''}`}
                onClick={() => isTxClickable(transaction.txHash) && openSolscanLink(transaction.txHash)}
                style={{
                  cursor: isTxClickable(transaction.txHash) ? 'pointer' : 'default',
                  opacity: isTxClickable(transaction.txHash) ? 1 : 0.6,
                  marginTop: '0.5rem',
                  color: isTxClickable(transaction.txHash) ? '#00ffff' : '#888',
                  fontSize: '0.8rem'
                }}
                title={isTxClickable(transaction.txHash) ? 'Click to view on Solscan' : 'Transaction not available on explorer'}
              >
                TX: {formatTxHash(transaction.txHash)}
                {isTxClickable(transaction.txHash) && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    fontSize: '0.6rem',
                    opacity: 0.8
                  }}>
                    🔗
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBuys;