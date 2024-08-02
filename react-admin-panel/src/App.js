import React, { useState, useEffect } from 'react';
import ContestForm from './components/ContestForm';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import Timer from './components/Timer';
import SpecialPageRedirect from './components/SpecialPageRedirect';
import Heads from './components/Heads';
import Foots from './components/Foots';
import Login from './components/Login';
import Dashboard from './Dashboard';
import { Analytics } from '@vercel/analytics/react';



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
      <Heads />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path="/rooms/:roomName" element={<Quiz />} />
          <Route path='/timer' element={<Timer />} />
          <Route path="/special/:roomName" element={<SpecialPageRedirect/>} />
        </Routes>
      <Foots />
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('access_token') ? children : <Navigate to="/login" replace />;
};

export default App;
