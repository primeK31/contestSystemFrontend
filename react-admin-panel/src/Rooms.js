import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomList from './components/RoomList';
import Quiz from './components/Quiz';
import { AuthProvider } from './components/AuthContext';



const Rooms = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState('');
  const [enteredRoom, setEnteredRoom] = useState(false);

  const handleSelectRoom = (room) => {
    setRoomName(room);
    setEnteredRoom(true);
  };

  useEffect(() => {
    if (token) {
      console.log('Success!');
    }
  }, [token]);


  const login = async () => {
    try {
      const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username,
        password
      }));
      setToken(response.data.access_token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      {!enteredRoom ? (
        <div>
          <RoomList onSelectRoom={handleSelectRoom} />
        </div>
      ) : (
        <div>
          <AuthProvider>
            <Quiz roomName={roomName} />
          </AuthProvider>
        </div>
      )}
    </div>
  );
};

export default Rooms;
