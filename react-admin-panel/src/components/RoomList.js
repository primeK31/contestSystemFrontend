import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('https://contestsystembackend.onrender.com/rooms/');
      setRooms(response.data);
    };
    const fetchContests = async () => {
      const response = await axios.get('https://contestsystembackend.onrender.com/supercontests/');
      setContests(response.data);
    };

    fetchRooms();
    fetchContests();
  }, []);

  const getContestName = (contestId) => {
    const contest = contests.find(c => c.id === contestId);
    return contest ? contest.name : 'Unknown Contest';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Rooms</h2>
      {rooms.length === 0 ? (
        <p className="text-gray-600">No rooms available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out"
              onClick={() => onSelectRoom(room.name)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
                <span className="text-sm text-gray-600">
                  Starts: {formatDate(room.start_time)} UTC+00:00
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Contest: {getContestName(room.contests)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;