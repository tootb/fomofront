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
    // Get API URL from environment variable or default to Render backend
    const API_URL = process.env.REACT_APP_SERVER_URL || 'https://fomoback.onrender.com';
    
    console.log('🔗 Using real-time HTTP polling for game state');
    console.log('📡 API URL:', API_URL);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    
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

    // Keep-alive function every 2 minutes to prevent Render from sleeping
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
          console.log('🔄 Frontend keep-alive (Render):', data.status, `uptime: ${Math.floor(data.uptime / 60)}min`);
        }
      } catch (error) {
        console.error('❌ Keep-alive failed:', error.message);
      }
    };

    // Initial fetch
    console.log('🚀 Starting real-time polling (1 second intervals) for Render backend...');
    fetchGameState();
    
    // Initial keep-alive
    keepAlive();
    
    // Game state polling every 1 SECOND for real-time updates
    const gameStateInterval = setInterval(() => {
      fetchGameState();
    }, 1000);
    
    // Keep-alive every 2 MINUTES to prevent backend from sleeping
    const keepAliveInterval = setInterval(() => {
      keepAlive();
    }, 2 * 60 * 1000);
    
    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up polling intervals');
      clearInterval(gameStateInterval);
      clearInterval(keepAliveInterval);
    };
  }, []);

  return gameState;
};