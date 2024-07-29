import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';

const SpecialPageRedirect = () => {
  const [backendTime, setBackendTime] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeDifference, setTimeDifference] = useState(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const { roomName } = useParams();

  const fetchBackendTime = useCallback(async () => {
    try {
      console.log(roomName);
      const response = await fetch(`http://localhost:8000/rooms/${roomName}`);
      const lol = await fetch(`http://localhost:8000/server-time`);
      const lol_data = await lol.json();
      const data = await response.json();
      setBackendTime(new Date(data.start_time));
      setServerTime(new Date(lol_data.server_time));
    } catch (error) {
      console.error('Error fetching backend time:', error);
    }
  }, [roomName]);

  useEffect(() => {
    fetchBackendTime();
  }, [fetchBackendTime]);

  useEffect(() => {
    const updateTimeAndCheck = () => {
      const now = new Date();
      const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      setCurrentTime(nowUTC);

      if (backendTime) {
        const diff = backendTime.getTime() - nowUTC.getTime();
        setTimeDifference(diff);

        if (diff <= 0) {
          setIsRoomOpen(true);
        }
      }
    };

    const intervalId = setInterval(updateTimeAndCheck, 1000);
    updateTimeAndCheck();

    return () => clearInterval(intervalId);
  }, [backendTime]);

  const formatTimeDifference = (diff) => {
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isRoomOpen) {
    return <Quiz roomName={roomName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Room: {roomName}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The room will open soon. Please wait.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Time until room opens</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {timeDifference !== null ? (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {formatTimeDifference(timeDifference)}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Calculating...
                  </span>
                )}
              </dd>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SpecialPageRedirect;