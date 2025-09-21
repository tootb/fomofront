import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    timeLeft: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    isActive: false, // Start inactive
    waitingForFirstBuy: true, // Waiting for first buy
    currentRound: 1,
    currentLevel: 1,
    currentLevelStartTime: null,
    pot: 0,
    recentBuys: [],
    winners: {},
    gameStartTime: Date.now(),
    connected: false
  });

  useEffect(() => {
    const API_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_API_URL || 'https://fomoback.vercel.app';
    
    console.log('🔗 Using HTTP polling for game state');
    console.log('📡 API URL:', API_URL);
    
    const fetchGameState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/game/state`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Game state received:', {
            connected: true,
            round: data.currentRound,
            level: data.currentLevel,
            pot: data.pot,
            recentBuys: data.recentBuys?.length || 0,
            isActive: data.isActive,
            waitingForFirstBuy: data.waitingForFirstBuy,
            gameStartTime: data.gameStartTime,
            currentLevelStartTime: data.currentLevelStartTime,
            timeLeft: Math.floor(data.timeLeft / 1000) + 's'
          });
          
          setGameState(prevState => ({
            ...prevState,
            ...data,
            connected: true
          }));
        } else {
          console.error('❌ Failed to fetch game state:', response.status, response.statusText);
          setGameState(prevState => ({
            ...prevState,
            connected: false
          }));
        }
      } catch (error) {
        console.error('❌ Network error fetching game state:', error.message);
        setGameState(prevState => ({
          ...prevState,
          connected: false
        }));
      }
    };

    // Keep-alive function to prevent Vercel from sleeping
    const keepAlive = async () => {
      try {
        const response = await fetch(`${API_URL}/keep-alive`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔄 Keep-alive response:', {
            status: data.status,
            uptime: Math.floor(data.uptime / 60) + 'min',
            gameActive: data.gameActive,
            currentRound: data.currentRound,
            timeLeft: data.timeLeft
          });
        }
      } catch (error) {
        console.error('❌ Keep-alive failed:', error.message);
      }
    };

    // Function to check pot status
    const fetchPotStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pot-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('💰 Pot status:', data.currentPot, 'SOL');
          
          setGameState(prevState => ({
            ...prevState,
            pot: data.currentPot
          }));
        }
      } catch (error) {
        console.error('❌ Error fetching pot status:', error.message);
      }
    };

    // Initial fetch
    console.log('🚀 Starting initial game state fetch...');
    fetchGameState();
    
    // Initial keep-alive
    keepAlive();
    
    // Fetch pot status separately
    fetchPotStatus();
    
    // Poll game state every 1 second for real-time timer and transactions
    const gameStateInterval = setInterval(() => {
      fetchGameState();
    }, 1000);
    
    // Keep-alive every 2 minutes to prevent Vercel sleep
    const keepAliveInterval = setInterval(() => {
      keepAlive();
    }, 2 * 60 * 1000);
    
    // Poll pot status every 3 minutes
    const potStatusInterval = setInterval(() => {
      fetchPotStatus();
    }, 3 * 60 * 1000);
    
    // Cleanup
    return () => {
      console.log('🧹 Cleaning up HTTP polling intervals');
      clearInterval(gameStateInterval);
      clearInterval(keepAliveInterval);
      clearInterval(potStatusInterval);
    };
  }, []);

  return gameState;
};