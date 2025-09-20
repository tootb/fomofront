import React from 'react';
import moment from 'moment';

const RecentBuys = ({ buys }) => {
  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

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
              
              <div className="buy-wallet">
                {formatWallet(transaction.wallet)}
              </div>
              
              <div className="buy-time">
                {moment(transaction.timestamp).format('HH:mm:ss')}
              </div>
              
              <div className="buy-tx" style={{ 
                fontSize: '0.7rem', 
                color: 'rgba(0, 255, 255, 0.8)',
                wordBreak: 'break-all'
              }}>
                TX: {transaction.txHash ? `${transaction.txHash.slice(0, 8)}...` : 'N/A'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBuys;