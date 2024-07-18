import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(600); // Initialize with 600 seconds (10 minutes)
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            alert('Time is up!');
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive]);

  const startTimer = () => {
    setTime(600); // Set the timer for 10 minutes (600 seconds) for this example
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(600); // Reset to 10 minutes (600 seconds)
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">React Timer</h1>
      <div className="text-6xl font-mono mb-8">
        <span>{formatTime(time)}</span>
      </div>
      <div className="space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
          onClick={startTimer}
        >
          Start
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
