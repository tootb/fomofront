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
        borderColor="rgba(0, 255, 255, 0.1)"
        squareSize={50}
        hoverFillColor="rgba(0, 255, 255, 0.05)"
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
        <div className="left-panel">
          <LevelProgress 
            currentRound={gameState.currentRound}
            currentLevel={gameState.currentLevel}
            gameStartTime={gameState.gameStartTime}
            isActive={gameState.isActive}
            currentLevelStartTime={gameState.currentLevelStartTime}
          />
        </div>

        <div className="center-panel">
          <PotDisplay pot={gameState.pot} />
          <Timer 
            timeLeft={gameState.timeLeft}
            isActive={gameState.isActive}
            waitingForFirstBuy={gameState.waitingForFirstBuy}
          />
          <Winners winners={gameState.winners} />
        </div>

        {/* Right panel - Recent Transactions */}
        <div className="right-panel">
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