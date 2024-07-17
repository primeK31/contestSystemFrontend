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
import { AuthProvider } from './components/AuthContext';
import AdminPanel from './AdminPanel';
import Rooms from './Rooms';
import Home from './Home';



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
      const response = await axios.post('https://contestsystembackend.onrender.com/token', new URLSearchParams({
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
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/rooms' element={<Rooms />} />
      </Routes>
    </div>
  );
};

export default App;
