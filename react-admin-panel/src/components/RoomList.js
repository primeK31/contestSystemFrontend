import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const RoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomContests, setNewRoomContests] = useState('');
  const [contests, setContests] = useState([]);
  const [loadingContests, setLoadingContests] = useState(false);
  const [selectedContest, setSelectedContest] = useState('');
  const [contestJson, setContestJson] = useState([]);
  const [rating, setRating] = useState([]);


  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('http://localhost:8000/rooms/');
      setRooms(response.data);
    };
    const fetchContests = async () => {
      const response = await axios.get('http://localhost:8000/contests/');
      // const response = await axios.get('http://localhost:8000/supercontests/');
      console.log(response.data);
      setContests(response.data);
    };

    fetchRooms();
    fetchContests();
  }, []);

  const createRoom = async () => {
    if (newRoomName && selectedContest) {
      console.log(newRoomName);
      console.log(contestJson);
      await axios.post('http://localhost:8000/rooms/', {
        name: newRoomName,
        contests: contestJson,
      });
      setRooms([...rooms, { name: newRoomName, contests: contestJson }]);
      setNewRoomName('');
      setNewRoomContests('');
    }
  };


  const handleSelect = (event) => {
    setContestJson(contests.find(c => c.name === event.target.value));
    setSelectedContest(event.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <ul className="mb-4">
        {rooms.map((room, index) => (
          <li 
            key={index} 
            className="p-2 mb-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" 
            onClick={() => onSelectRoom(room.name)}
          >
            {room.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Room Name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <select 
        value={selectedContest} 
        onChange={handleSelect} 
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="">Select a contest</option>
        {contests.map((contest, index) => (
          <option key={index} value={contest.name}>
            {contest.name}
          </option>
        ))}
      </select>
      <button 
        onClick={createRoom} 
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Room
      </button>
    </div>
  );
};

export default RoomList;
