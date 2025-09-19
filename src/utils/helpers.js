import { ROUND_1_LEVELS, ROUND_N_LEVELS } from './constants';

export const getCurrentLevel = (round, gameStartTime) => {
  const elapsed = Date.now() - gameStartTime;
  const levels = round === 1 ? ROUND_1_LEVELS : ROUND_N_LEVELS;
  
  let totalTime = 0;
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].duration === Infinity) {
      return { level: i + 1, requirement: levels[i].requirement };
    }
    
    totalTime += levels[i].duration * 60 * 60 * 1000; // Convert hours to ms
    if (elapsed < totalTime) {
      return { level: i + 1, requirement: levels[i].requirement };
    }
  }
  
  // Return last level if time exceeded
  const lastLevel = levels[levels.length - 1];
  return { level: levels.length, requirement: lastLevel.requirement };
};

export const isValidBuy = (amount, round, gameStartTime) => {
  const currentLevel = getCurrentLevel(round, gameStartTime);
  return amount >= currentLevel.requirement;
};

export const formatWallet = (wallet) => {
  if (!wallet || wallet.length < 12) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
};

export const formatAmount = (amount, decimals = 2) => {
  return parseFloat(amount || 0).toFixed(decimals);
};

export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  };
};

export const calculateWinnerPrizes = (potAmount) => {
  return [
    { place: 1, amount: potAmount * 0.7, percentage: 70 },
    { place: 2, amount: potAmount * 0.2, percentage: 20 },
    { place: 3, amount: potAmount * 0.1, percentage: 10 }
  ];
};