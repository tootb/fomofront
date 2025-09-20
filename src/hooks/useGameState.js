import { useState, useEffect } from 'react';
import io from 'socket.io-client';

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
    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
      extraHeaders: {},
      withCredentials: false,
      transportOptions: {
        polling: { extraHeaders: {} },
        websocket: { extraHeaders: {} }
      }
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setGameState(prevState => ({
        ...prevState,
        connected: true
      }));
      
      // Request initial game state
      setTimeout(() => {
        newSocket.emit('requestGameState');
      }, 500);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      setGameState(prevState => ({
        ...prevState,
        connected: false
      }));
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setGameState(prevState => ({
        ...prevState,
        connected: false
      }));
    });

    // Listen for game state updates
    newSocket.on('gameStateUpdate', (state) => {
      console.log('Game state update received:', state);
      setGameState(prevState => ({
        ...prevState,
        ...state,
        connected: true
      }));
    });

    // Listen for timer updates
    newSocket.on('timerUpdate', (data) => {
      setGameState(prevState => ({
        ...prevState,
        timeLeft: data.timeLeft,
        isActive: data.isActive
      }));
    });

    // Listen for new buy transactions
    newSocket.on('newBuy', (buyData) => {
      console.log('New buy received:', buyData);
      setGameState(prevState => ({
        ...prevState,
        recentBuys: [buyData, ...prevState.recentBuys].slice(0, 50),
        timeLeft: buyData.newTimeLeft || prevState.timeLeft,
        pot: buyData.newPot || prevState.pot
      }));
    });

    // Listen for new sell transactions
    newSocket.on('newSell', (sellData) => {
      console.log('New sell received:', sellData);
      setGameState(prevState => ({
        ...prevState,
        recentBuys: [sellData, ...prevState.recentBuys].slice(0, 50),
        timeLeft: sellData.newTimeLeft || prevState.timeLeft
      }));
    });

    // Listen for round changes
    newSocket.on('roundChange', (roundData) => {
      setGameState(prevState => ({
        ...prevState,
        currentRound: roundData.round,
        currentLevel: 1,
        timeLeft: roundData.timeLeft,
        isActive: false,
        waitingForFirstBuy: roundData.waitingForFirstBuy || false,
        gameStartTime: Date.now()
      }));
    });

    // Listen for game start event
    newSocket.on('gameStarted', (data) => {
      setGameState(prevState => ({
        ...prevState,
        isActive: true,
        waitingForFirstBuy: false,
        timeLeft: data.timeLeft,
        gameStartTime: Date.now()
      }));
    });

    // Listen for level changes
    newSocket.on('levelChange', (levelData) => {
      setGameState(prevState => ({
        ...prevState,
        currentLevel: levelData.level
      }));
    });

    // Listen for winners announcement
    newSocket.on('winnersAnnounced', (winnersData) => {
      setGameState(prevState => ({
        ...prevState,
        winners: {
          ...prevState.winners,
          [winnersData.round]: winnersData.winners
        },
        isActive: false
      }));
    });

    // Listen for pot updates
    newSocket.on('potUpdate', (potData) => {
      setGameState(prevState => ({
        ...prevState,
        pot: potData.amount
      }));
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return gameState;
};