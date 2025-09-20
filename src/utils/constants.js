// Token configuration
export const TARGET_TOKEN = '3xqp9ybyD9ijcwwt2GVja1WFVioFZxgc283Jma2Spump';

// Game configuration
export const GAME_CONFIG = {
  TOKEN_SYMBOL: '$FOMO',
  TOKEN_ADDRESS: '3xqp9ybyD9ijcwwt2GVja1WFVioFZxgc283Jma2Spump',
  MIN_BUY_AMOUNT: 0.1
};

// Game timing constants
export const INITIAL_TIME = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
export const MAX_TIME = 24 * 60 * 60 * 1000; // 24 hours max
export const MIN_TIME = 5 * 60 * 1000; // 5 minutes minimum
export const TIME_ADDITION = 30 * 1000; // 30 seconds in milliseconds

// Round 1 level configuration
export const ROUND_1_LEVELS = [
  { level: 1, requirement: 0.1, duration: 2 }, // 2 hours
  { level: 2, requirement: 0.2, duration: 2 }, // 2 hours  
  { level: 3, requirement: 0.5, duration: 2 }, // 2 hours
  { level: 4, requirement: 1.0, duration: 5 }, // 5 hours
  { level: 5, requirement: 2.0, duration: 5 }, // 5 hours
  { level: 6, requirement: 5.0, duration: 12 }, // 12 hours
  { level: 7, requirement: 10.0, duration: 12 }, // 12 hours
  { level: 8, requirement: 15.0, duration: 12 }, // 12 hours
  { level: 9, requirement: 20.0, duration: Infinity } // Until timer ends
];

// Round 2+ level configuration
export const ROUND_N_LEVELS = [
  { level: 1, requirement: 1.0, duration: 5 }, // 5 hours
  { level: 2, requirement: 2.0, duration: 5 }, // 5 hours
  { level: 3, requirement: 5.0, duration: 12 }, // 12 hours
  { level: 4, requirement: 10.0, duration: 12 }, // 12 hours
  { level: 5, requirement: 15.0, duration: 12 }, // 12 hours
  { level: 6, requirement: 20.0, duration: Infinity } // Until timer ends
];

// Winner distribution percentages
export const WINNER_DISTRIBUTION = [
  { place: 1, percentage: 70 },
  { place: 2, percentage: 20 },
  { place: 3, percentage: 10 }
];

// Transaction types
export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
};