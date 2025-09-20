import React from 'react';
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
  const gameState = useGameState();

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