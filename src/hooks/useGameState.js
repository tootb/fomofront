import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const useGameState = () => {
  const [socket, setSocket] = useState(null);
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
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
    
    // Optimized Socket.IO configuration to reduce header size
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'], // Allow both but prefer websocket
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
      // Minimize headers
      extraHeaders: {},
      // Disable cookies to reduce header size
      withCredentials: false,
      // Optimize transport options
      transportOptions: {
        polling: {
          extraHeaders: {}
        },
        websocket: {
          extraHeaders: {}
        }
      }
    });
    
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setGameState(prevState => ({
        ...prevState,
        connected: true
      }));
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      setGameState(prevState => ({
        ...prevState,
        connected: false
      }));
      if (error.message.includes('431') || error.message.includes('Request Header Fields Too Large')) {
        console.log('Trying to reconnect with minimal headers...');
        // Force websocket only on header size error
        newSocket.io.opts.transports = ['websocket'];
      }
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
      setGameState(prevState => ({
        ...prevState,
        recentBuys: [buyData, ...prevState.recentBuys].slice(0, 50),
        timeLeft: buyData.newTimeLeft || prevState.timeLeft,
        pot: buyData.newPot || prevState.pot
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

    // Request initial game state after connection
    newSocket.on('connect', () => {
      setTimeout(() => {
        newSocket.emit('requestGameState');
      }, 500);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return gameState;
};