import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestForm from './ContestForm';

const RoomCreatingForm = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [contests, setContests] = useState([]);
  const [selectedContestId, setSelectedContestId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');

  
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('http://localhost:8000/rooms/');
      setRooms(response.data);
    };
    const fetchContests = async () => {
      const response = await axios.get('http://localhost:8000/supercontests/');
      setContests(response.data);
    };

    fetchRooms();
    fetchContests();
  }, []);

  const createRoom = async () => {
    if (newRoomName && selectedContestId && startDate && startTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const roomData = {
        name: newRoomName,
        contest_name: selectedContestId,  // Send contest ID instead of the whole object
        start_time: startDateTime.toISOString()
      };

      try {
        console.log(roomData);
        const response = await axios.post('http://localhost:8000/rooms/', roomData);
        setRooms([...rooms, response.data]);
        setNewRoomName('');
        setSelectedContestId('');
        setStartDate('');
        setStartTime('');
      } catch (error) {
        console.error('Error creating room:', error);
      }
    }
  };

  const handleContestCreated = (newContest) => {
    setContests([...contests, newContest]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Room</h2>
      
      {rooms.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Existing Rooms</h3>
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li 
                key={room.id} 
                className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out"
                onClick={() => onSelectRoom(room.name)}
              >
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
          <input
            id="roomName"
            type="text"
            placeholder="Enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contestSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Contest</label>
          <select 
            id="contestSelect"
            value={selectedContestId}
            onChange={(e) => setSelectedContestId(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a contest</option>
            {contests.map((contest) => (
              <option key={contest.id} value={contest.id}>
                {contest.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={createRoom} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
      >
        Create Room
      </button>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Contest</h2>
        <ContestForm onContestCreated={handleContestCreated} />
      </div>
    </div>
  );
};

export default RoomCreatingForm;