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
    
    console.log('🔗 Using real-time HTTP polling for game state');
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

    // Keep-alive function cada 2 minutos
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
          console.log('🔄 Frontend keep-alive:', data.status, `uptime: ${Math.floor(data.uptime / 60)}min`);
        }
      } catch (error) {
        console.error('❌ Keep-alive failed:', error.message);
      }
    };

    // Initial fetch
    console.log('🚀 Starting real-time polling (1 second intervals)...');
    fetchGameState();
    
    // Initial keep-alive
    keepAlive();
    
    // 🎯 CONFIGURACIÓN SOLICITADA:
    
    // Game state cada 1 SEGUNDO para timer real-time
    const gameStateInterval = setInterval(() => {
      fetchGameState();
    }, 1000);
    
    // Keep-alive cada 2 MINUTOS para evitar sleep
    const keepAliveInterval = setInterval(() => {
      keepAlive();
    }, 2 * 60 * 1000);
    
    // Cleanup
    return () => {
      console.log('🧹 Cleaning up real-time polling intervals');
      clearInterval(gameStateInterval);
      clearInterval(keepAliveInterval);
    };
  }, []);

  return gameState;
};