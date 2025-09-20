import React from 'react';

const RulesModal = ({ onClose }) => {
  return (
    <div className="rules-modal-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <h2>🎮 Pump FOMO 3D - Rules</h2>
        
        <h3>🎯 Game Objective</h3>
        <p>
          Pump FOMO 3D is a game where <strong>the last 3 buyers before the timer ends take the entire pot</strong>.
        </p>

        <h3>⏰ How the Timer Works</h3>
        <ul>
          <li><strong>Each valid BUY:</strong> Adds +30 seconds to the timer</li>
          <li><strong>Each valid SELL:</strong> Subtracts -30 seconds from the timer</li>
          <li><strong>Game starts:</strong> With the first valid purchase of the round</li>
          <li><strong>Initial timer:</strong> 6 hours per round</li>
        </ul>

        <h3>🎯 Level System and Valid Transactions</h3>
        <p><strong>⚠️ IMPORTANT:</strong> For a transaction to be valid and affect the timer, it must meet the <strong>minimum amount of the current level</strong>.</p>
        
        <div style={{ 
          background: 'rgba(255, 255, 0, 0.1)', 
          border: '1px solid #ffff00', 
          padding: '1rem', 
          borderRadius: '10px',
          margin: '1rem 0'
        }}>
          <h4 style={{ color: '#ffff00', margin: '0 0 0.5rem 0' }}>Example:</h4>
          <p style={{ margin: '0.25rem 0' }}>• If we are in <strong>Level 3</strong> which requires <strong>0.5 SOL minimum</strong></p>
          <p style={{ margin: '0.25rem 0' }}>• Only buys/sells of <strong>0.5 SOL or more</strong> will add/subtract 30 seconds</p>
          <p style={{ margin: '0.25rem 0' }}>• A 0.3 SOL purchase will be <strong>ignored</strong> (doesn't affect timer)</p>
        </div>

        <h3>⏱️ Timer Limits</h3>
        <ul>
          <li><strong>Maximum with BUYs:</strong> Timer can never exceed <span style={{color: '#00ff00'}}>24 hours</span></li>
          <li><strong>Minimum with SELLs:</strong> Timer can never go below <span style={{color: '#ff6666'}}>5 minutes</span></li>
          <li>If timer is at 5 minutes, valid SELLs won't reduce it further</li>
          <li>If timer is at 24 hours, valid BUYs won't increase it further</li>
        </ul>

        <h3>💰 The Pot (Prize Pool)</h3>
        <p>
          The pot is formed by the balance of the wallet: <br/>
          <code>6b2XzUeXiTMVs1TmDEJaBb8qpkgRECHhp8d7knnYLHXK</code>
        </p>
        <p>
          This wallet is checked every 5 minutes to display the exact amount of SOL available as prize.
        </p>
        <p>
          <strong>70% of pump.fun fees</strong> go to the POT and <strong>30% for buy and burns</strong>.
        </p>

        <h3>🏆 Winner System</h3>
        <ul>
          <li><strong>1st place (70%):</strong> The last buyer before timer ends</li>
          <li><strong>2nd place (20%):</strong> The second-to-last buyer</li>
          <li><strong>3rd place (10%):</strong> The third-to-last buyer</li>
        </ul>

        <h3>📊 Levels and Requirements</h3>
        <p><strong>Round 1:</strong></p>
        <ul>
          <li>Level 1: 0.1 SOL minimum (2 hours)</li>
          <li>Level 2: 0.2 SOL minimum (2 hours)</li>
          <li>Level 3: 0.5 SOL minimum (2 hours)</li>
          <li>Level 4: 1.0 SOL minimum (5 hours)</li>
          <li>Level 5+: Higher requirements...</li>
        </ul>

        <p><strong>Rounds 2+:</strong></p>
        <ul>
          <li>Level 1: 1.0 SOL minimum (5 hours)</li>
          <li>Level 2: 2.0 SOL minimum (5 hours)</li>
          <li>Level 3+: Progressive requirements...</li>
        </ul>

        <h3>⚡ Valid Transactions</h3>
        <p>
          <strong>Only transactions that meet the current level's minimum amount</strong> can:
        </p>
        <ul>
          <li>Add/subtract time from the timer</li>
          <li>Become candidates to win the pot</li>
          <li>Appear as "last buyers" for prize distribution</li>
          <li>Appear in the transactions list</li>
        </ul>
        <p>
          Transactions below the required level <strong>will not appear in the list</strong> and won't affect the game.
        </p>

        <h3>🔄 New Rounds</h3>
        <p>
          When a round ends, a new round automatically starts after 30 seconds. The game is continuous and each round has its own winners.
        </p>

        <h3>🎲 Strategy</h3>
        <p>
          <strong>Do you buy early to participate longer, or wait until the end to be the last buyer?</strong> 
          The choice is yours, but remember that each purchase extends the countdown!
        </p>
      </div>
    </div>
  );
};

export default RulesModal;