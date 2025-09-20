import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    timeLeft: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    isActive: false, // Start inactive
    waitingForFirstBuy: true, // Waiting for first buy
    currentRound: 1,
    currentLevel: 1,
    pot: 0,
    recentBuys: [],
    winners: {},
    gameStartTime: Date.now(),
    connected: false
  });

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'https://fomoback.vercel.app';
    
    console.log('🔗 Using HTTP polling instead of WebSocket');
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
            isActive: data.isActive
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

    // Initial fetch
    console.log('🚀 Starting initial game state fetch...');
    fetchGameState();
    
    // Poll every 2 seconds for real-time updates
    const interval = setInterval(() => {
      fetchGameState();
    }, 2000);
    
    // Cleanup
    return () => {
      console.log('🧹 Cleaning up HTTP polling interval');
      clearInterval(interval);
    };
  }, []);

  return gameState;
};