import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    timeLeft: 5 * 60 * 60 * 1000, // CHANGED TO 5 HOURS
    isActive: false,
    waitingForFirstBuy: true,
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
    const API_URL = process.env.REACT_APP_SERVER_URL || 'https://fomoback.onrender.com';
    
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
          setGameState(prevState => ({
            ...prevState,
            connected: false
          }));
        }
      } catch (error) {
        setGameState(prevState => ({
          ...prevState,
          connected: false
        }));
      }
    };

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
        }
      } catch (error) {
        // Silent handling
      }
    };

    fetchGameState();
    keepAlive();
    
    const gameStateInterval = setInterval(() => {
      fetchGameState();
    }, 1000);
    
    const keepAliveInterval = setInterval(() => {
      keepAlive();
    }, 2 * 60 * 1000);
    
    return () => {
      clearInterval(gameStateInterval);
      clearInterval(keepAliveInterval);
    };
  }, []);

  return gameState;
};