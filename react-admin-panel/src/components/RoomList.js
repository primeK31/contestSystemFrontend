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


  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('http://localhost:8000/rooms/');
      setRooms(response.data);
    };
    const fetchContests = async () => {
      const response = await axios.get('http://localhost:8000/contests/');
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
    <div>
      <List>
        {rooms.map((room, index) => (
          <ListItem key={index} button onClick={() => onSelectRoom(room.name)}>
            <ListItemText primary={room.name} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="New Room Name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
      />
      <select value={selectedContest} onChange={handleSelect}>
        <option value="">Select a contest</option>
        {contests.map((contest, index) => (
          <option key={index} value={contest.name}>
            {contest.name}
          </option>
        ))}
      </select>
      <Button variant="contained" color="primary" onClick={createRoom}>
        Create Room
      </Button>
    </div>
  );
};

export default RoomList;
