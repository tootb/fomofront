import React, { useState, useEffect } from 'react';
import './App.css';
import Timer from './components/Timer';
import PotDisplay from './components/PotDisplay';
import RecentBuys from './components/RecentBuys';
import Winners from './components/Winners';
import LevelProgress from './components/LevelProgress';
import RulesModal from './components/RulesModal';
import Squares from './components/Squares';
import { useGameState } from './hooks/useGameState';
import { GAME_CONFIG } from './utils/constants';

function App() {
  const gameState = useGameState();
  const [showRules, setShowRules] = useState(false);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing page every 5 minutes');
      window.location.reload();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="App">
      <Squares 
        direction="diagonal"
        speed={0.5}
        borderColor="rgba(255, 255, 255, 0.2)"
        squareSize={50}
        hoverFillColor="rgba(0, 255, 255, 0.1)"
      />
      
      <div className="app-header">
        <h1 className="app-title">Pump FOMO 3D</h1>
        <div className="app-subtitle">Last 3 buyers take the pot</div>
        <button 
          className="rules-button"
          onClick={() => setShowRules(true)}
        >
          How it Works
        </button>
      </div>

      <div className="main-container">
        {/* Left panel - Level Requirements */}
        <div className="left-panel mobile-order-5">
          <LevelProgress 
            currentRound={gameState.currentRound}
            currentLevel={gameState.currentLevel}
            gameStartTime={gameState.gameStartTime}
            isActive={gameState.isActive}
            currentLevelStartTime={gameState.currentLevelStartTime}
          />
        </div>

        <div className="center-panel">
          <div className="mobile-order-1">
            <PotDisplay pot={gameState.pot} />
          </div>
          <div className="mobile-order-2">
            <Timer 
              timeLeft={gameState.timeLeft}
              isActive={gameState.isActive}
              waitingForFirstBuy={gameState.waitingForFirstBuy}
            />
          </div>
          <div className="winners-in-center mobile-order-4">
            <Winners winners={gameState.winners} />
          </div>
        </div>

        {/* Right panel - Recent Transactions */}
        <div className="right-panel mobile-order-3">
          <RecentBuys buys={gameState.recentBuys} />
        </div>
      </div>

      <div className="footer">
        <div className="token-address">
          Token: {GAME_CONFIG.TOKEN_SYMBOL} | {GAME_CONFIG.TOKEN_ADDRESS}
        </div>
        <div className="backend-status">
           {gameState.connected ? '🟢 ' : '🔴 '}
        </div>
      </div>

      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} />
      )}
    </div>
  );
}

export default App;