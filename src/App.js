import React, { useState } from 'react';
import './App.css';
import Timer from './components/Timer';
import PotDisplay from './components/PotDisplay';
import RecentBuys from './components/RecentBuys';
import Winners from './components/Winners';
import RoundInfo from './components/RoundInfo';
import LevelProgress from './components/LevelProgress';
import { useGameState } from './hooks/useGameState';
import { GAME_CONFIG } from './utils/constants';

function App() {
  const [buyAmount, setBuyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const gameState = useGameState();

  const handleBuyKeys = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(buyAmount),
          wallet: 'demo_wallet_address' // Replace with actual wallet
        })
      });

      if (response.ok) {
        setMessage(`Successfully bought ${buyAmount} keys!`);
        setMessageType('success');
        setBuyAmount('');
      } else {
        setMessage('Failed to buy keys. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuyKeys();
    }
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">FOMO GAME</h1>
        <div className="app-subtitle">Last Buy Wins The Pot</div>
      </div>

      <div className="main-container">
        <div className="left-panel">
          <Winners winners={gameState.winners} />
        </div>

        <div className="center-panel">
          <PotDisplay pot={gameState.pot} />
          <Timer 
            timeLeft={gameState.timeLeft}
            isActive={gameState.isActive}
            waitingForFirstBuy={gameState.waitingForFirstBuy}
          />
          
          {/* Buy Section */}
          <div className="buy-section">
            <h3>Buy Keys</h3>
            <input
              type="number"
              className="buy-input"
              placeholder={`Enter ${GAME_CONFIG.TOKEN_SYMBOL} amount`}
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !gameState.isActive}
              min="0"
              step="0.1"
            />
            <button
              className="buy-button"
              onClick={handleBuyKeys}
              disabled={isLoading || !gameState.isActive || !buyAmount}
            >
              {isLoading ? (
                <>
                  Buying Keys
                  <span className="loading-spinner"></span>
                </>
              ) : (
                'Buy Keys'
              )}
            </button>
            
            {message && (
              <div className={`${messageType}-message`}>
                {message}
              </div>
            )}
          </div>

          <RoundInfo 
            currentRound={gameState.currentRound}
            currentLevel={gameState.currentLevel}
          />
          <LevelProgress 
            currentRound={gameState.currentRound}
            currentLevel={gameState.currentLevel}
            gameStartTime={gameState.gameStartTime}
          />
        </div>

        <div className="right-panel">
          <RecentBuys buys={gameState.recentBuys} />
        </div>
      </div>

      <div className="footer">
        <div className="token-address">
          Token: {GAME_CONFIG.TOKEN_SYMBOL} | {GAME_CONFIG.TOKEN_ADDRESS}
        </div>
        <div className="backend-status">
          Backend: {gameState.connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
    </div>
  );
}

export default App;