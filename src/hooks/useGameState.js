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
    const serverUrl = process.env.REACT_APP_API_URL || 'https://fomoback.vercel.app';
    
    console.log('🔗 Attempting to connect to:', serverUrl);
    
    // Updated Socket.IO configuration for better Vercel compatibility
    const newSocket = io(serverUrl, {
      transports: ['polling', 'websocket'], // Polling first for Vercel
      upgrade: true,
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 5,
      forceNew: false,
      autoConnect: true,
      // Remove headers that might cause issues
      extraHeaders: {},
      withCredentials: false
    });

    // Connection event handlers with better logging
    newSocket.on('connect', () => {
      console.log('✅ Successfully connected to backend!');
      console.log('Socket ID:', newSocket.id);
      console.log('Transport:', newSocket.io.engine.transport.name);
      
      setGameState(prevState => ({
        ...prevState,
        connected: true
      }));
      
      // Request initial game state after successful connection
      setTimeout(() => {
        console.log('📤 Requesting initial game state...');
        newSocket.emit('requestGameState');
      }, 1000);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      console.log('Error details:', error);
      console.log('Attempted URL:', serverUrl);
      
      setGameState(prevState => ({
        ...prevState,
        connected: false
      }));
    });

    newSocket.on('disconnect', (reason) => {
      console.log('📡 Disconnected from backend:', reason);
      setGameState(prevState => ({
        ...prevState,
        connected: false
      }));
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message);
    });

    // Listen for game state updates
    newSocket.on('gameStateUpdate', (state) => {
      console.log('📊 Game state update received:', state);
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
      console.log('🟢 New buy received:', buyData);
      setGameState(prevState => ({
        ...prevState,
        recentBuys: [buyData, ...prevState.recentBuys].slice(0, 50),
        timeLeft: buyData.newTimeLeft || prevState.timeLeft,
        pot: buyData.newPot || prevState.pot
      }));
    });

    // Listen for new sell transactions
    newSocket.on('newSell', (sellData) => {
      console.log('🔴 New sell received:', sellData);
      setGameState(prevState => ({
        ...prevState,
        recentBuys: [sellData, ...prevState.recentBuys].slice(0, 50),
        timeLeft: sellData.newTimeLeft || prevState.timeLeft
      }));
    });

    // Listen for round changes
    newSocket.on('roundChange', (roundData) => {
      console.log('🎮 Round change:', roundData);
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
      console.log('🚀 Game started:', data);
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
      console.log('📈 Level change:', levelData);
      setGameState(prevState => ({
        ...prevState,
        currentLevel: levelData.level
      }));
    });

    // Listen for winners announcement
    newSocket.on('winnersAnnounced', (winnersData) => {
      console.log('🏆 Winners announced:', winnersData);
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
      console.error('🔥 Socket error:', error);
    });

    // Transport upgrade event
    newSocket.io.on('upgrade', () => {
      console.log('📶 Upgraded to', newSocket.io.engine.transport.name);
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  return gameState;
};