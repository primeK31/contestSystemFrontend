import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SpecialPageRedirect = () => {
  const [backendTime, setBackendTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeDifference, setTimeDifference] = useState(null);
  const navigate = useNavigate();

  // Fetch backend time
  const fetchBackendTime = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/rooms/room1003'); // Replace with your backend endpoint
      const data = await response.json();
      setBackendTime(new Date(data.start_time)); // Assuming the backend returns an object with a datetime field
    } catch (error) {
      console.error('Error fetching backend time:', error);
    }
  }, []);

  useEffect(() => {
    fetchBackendTime();
  }, [fetchBackendTime]);

  useEffect(() => {
    // Function to update the current time and check if it matches the backend time
    const updateTimeAndCheck = () => {
      const now = new Date();
      setCurrentTime(now);

      if (backendTime) {
        const diff = backendTime.getTime() - now.getTime();
        setTimeDifference(diff);

        if (diff <= 0) {
          navigate('/'); // Replace with your special page route
        }
      }
    };

    // Update time every second
    const intervalId = setInterval(updateTimeAndCheck, 1000);

    // Initial call to set the current time immediately
    updateTimeAndCheck();

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [backendTime, navigate]);

  const formatTimeDifference = (diff) => {
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <p>Current Time: {currentTime.toLocaleTimeString()}</p>
      <p>Backend Time: {backendTime ? backendTime.toLocaleTimeString() : 'Loading...'}</p>
      <p>Time Difference: {timeDifference !== null ? formatTimeDifference(timeDifference) : 'Calculating...'}</p>
      <p>Checking time...</p>
    </div>
  );
};

export default SpecialPageRedirect;
