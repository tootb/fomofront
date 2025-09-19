import React from 'react';
import moment from 'moment';

const RecentBuys = ({ buys }) => {
  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div className="recent-buys">
      <h3>Recent Valid Buys (Last 50)</h3>
      <div className="buys-list">
        {!buys || buys.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.5)', 
            padding: '2rem' 
          }}>
            No valid buys yet
          </div>
        ) : (
          buys.map((buy, index) => (
            <div key={buy.txHash || buy._id || index} className="buy-item">
              <div className="buy-amount">
                {formatAmount(buy.amount)} SOL
              </div>
              <div className="buy-wallet">
                {formatWallet(buy.wallet)}
              </div>
              <div className="buy-time">
                {moment(buy.timestamp).format('HH:mm:ss')}
              </div>
              <div className="buy-tx" style={{ 
                fontSize: '0.7rem', 
                color: 'rgba(0, 255, 255, 0.8)',
                wordBreak: 'break-all'
              }}>
                TX: {buy.txHash ? `${buy.txHash.slice(0, 8)}...` : 'N/A'}
              </div>
              {buy.round && (
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'rgba(255, 255, 0, 0.8)'
                }}>
                  Round {buy.round}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBuys;