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

  const [uploadStatus, setUploadStatus] = useState('');
  const [dragging, setDragging] = useState(false);
  const [ selectedFile, setSelectedFile ] = useState(null);

  const handleSelectRoom = (room) => {
    setRoomName(room);
    setEnteredRoom(true);
  };

  useEffect(() => {
    if (token) {
      console.log('Success!');
    }
  }, [token]);

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    console.log('Files:', files);
    // Simulate file upload success
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded ${files.length} file(s)`);
    }, 1000);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    handleFiles(files);
  };


  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded file`);
    }, 1000);
  };


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

  const onFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('prompt', textInput);
    console.log(textInput);

    const response = await fetch('https://contestsystembackend.onrender.com/aigen/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log(JSON.stringify(result.text));
    console.log(result.text);

    const res = await fetch('https://contestsystembackend.onrender.com/quiz/', {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {token ? (
        <>
          <RoomList onSelectRoom={handleSelectRoom} />
          <ContestForm />
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button 
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Login
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-center">AI</h2>
          <div>
          <div
              id="dropzone"
              className={`dropzone p-8 text-center border-2 border-dashed rounded-lg transition-colors ${dragging ? 'bg-gray-100' : 'bg-white'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <p className="mb-4 text-lg font-semibold text-gray-700">Drag & Drop your files here</p>
              <p className="text-sm text-gray-500">or click to select files</p>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={onFileChange}
              />
          </div>
          {uploadStatus && (
              <div className="mt-4 p-2 text-green-700 bg-green-100 border border-green-400 rounded">
                {uploadStatus}
              </div>
          )}
            <input 
              type="text" 
              value={textInput} 
              onChange={(e) => setTextInput(e.target.value)} 
              placeholder="Напишите свои предпочтения для формы" 
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button 
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" 
              onClick={onFileUpload}
            >
              Загрузить!
            </button>
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="spinner border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 mb-4"></div>
                <p className="loading-text text-sm">Получаем ответ от ИИ</p>
              </div>
            ) : (
              <div id="ready" className="text-center text-green-500 font-semibold">{message}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
