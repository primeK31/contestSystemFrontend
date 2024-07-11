import React, { useState, useEffect } from 'react';
import ContestForm from './components/ContestForm';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import User from './components/User'
import { TextField, Button } from '@mui/material';
import RoomList from './components/RoomList';
import Quiz from './components/Quiz';
import TestRoom from './components/TestRoom';
import Register from './components/Register';
import UserLogin from './components/UserLogin';


const App = () => {
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
          <TestRoom roomName={roomName} />
          <Quiz roomName={roomName} />
        </div>
      )}
      <Register />
      <UserLogin />
      {token ? (
      <ContestForm />
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;
