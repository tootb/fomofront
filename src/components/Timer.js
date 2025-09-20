import React from 'react';

const Timer = ({ timeLeft, isActive, waitingForFirstBuy }) => {
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const time = formatTime(timeLeft);

  const getTimerLabel = () => {
    if (waitingForFirstBuy) {
      return 'Waiting for First Buy to Start';
    } else if (isActive) {
      return 'Time Remaining';
    } else {
      return 'Game Ended';
    }
  };

  const getTimerClass = () => {
    if (waitingForFirstBuy) {
      return 'timer-container waiting';
    } else if (isActive) {
      return 'timer-container active';
    } else {
      return 'timer-container ended';
    }
  };

  return (
    <div className={getTimerClass()}>
      <div className="timer-display">
        {`${time.hours}:${time.minutes}:${time.seconds}`}
      </div>
      <div className="timer-label">
        {getTimerLabel()}
      </div>
      {waitingForFirstBuy && (
        <div className="waiting-message">
          Make a buy of 0.1 SOL or more to start the game!
        </div>
      )}
    </div>
  );
};

export default Timer;