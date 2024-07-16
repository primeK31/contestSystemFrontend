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



const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState('');
  const [enteredRoom, setEnteredRoom] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);

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

  const onFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('prompt', textInput);
    console.log(textInput);

    const response = await fetch('http://localhost:8000/aigen/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log(JSON.stringify(result.text));
    console.log(result.text);

    const res = await fetch('http://localhost:8000/quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: result.text
      });
  
    if (res.ok) {
        const data = await res.json();
        console.log('Success:', data);
    } else {
        const errorData = await res.json();
        console.error('Error:', errorData);
    }

    setLoading(false);
    setMessage('Готов к созданию формы');
  };

  return (
    <div>
      {token ? (
      <><RoomList onSelectRoom={handleSelectRoom} /><ContestForm /></>
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
          <h2>AI</h2>
          <div>
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Напишите свои предпочтения для формы" className="flex-1 p-2 m-5 border border-gray-200 rounded-l-lg" />
            <button className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50" onClick={onFileUpload}>Загрузить!</button>
            {loading ?                 <div><div className='flex items-center justify-center'>
                <div className="spinner"></div>
                </div>
            <div className='flex items-center justify-center'>
            <p className="loading-text text-sm">Получаем ответ от ИИ</p>
            </div> </div> : <div id="ready">{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
