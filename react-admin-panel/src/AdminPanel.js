import React, { useState, useEffect } from 'react';
import ContestForm from './components/ContestForm';
import axios from 'axios';
import RoomCreatingForm from './components/RoomCreatingForm';

const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [roomName, setRoomName] = useState('');
  const [enteredRoom, setEnteredRoom] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [uploadStatus, setUploadStatus] = useState('');
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage');
    }
  }, [token]);

  const handleSelectRoom = (room) => {
    setRoomName(room);
    setEnteredRoom(true);
  };

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
      setMessage('Login failed. Please try again.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setMessage('Logged out successfully');
  };

  const onFileUpload = async () => {
    setLoading(true);
    setMessage('');
    try {
      const form = new FormData();
      form.append('file', selectedFile);
      
      const compl = await fetch('https://contestsystembackend.onrender.com/uploadimage/', {
        method: 'POST',
        body: form,
      });

      const get = await compl.json();

      const formData = new FormData();
      formData.append('file_name', get.file_url);
      formData.append('prompt', textInput);

      const response = await fetch('https://contestsystembackend.onrender.com/aigen/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

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
        setMessage('Upload and processing completed successfully');
      } else {
        const errorData = await res.json();
        console.error('Error:', errorData);
        setMessage('An error occurred during processing');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8">
      {token ? (
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
          <RoomCreatingForm onSelectRoom={handleSelectRoom} />
          <ContestForm />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">AI generate quiz</h2>
            <div
              id="dropzone"
              className={`dropzone p-12 text-center border-3 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
                dragging ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <p className="mb-4 text-xl font-semibold text-gray-700">Drag & Drop your files here</p>
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
              <div className="mt-4 p-3 text-green-700 bg-green-100 border border-green-400 rounded-lg">
                {uploadStatus}
              </div>
            )}
            <input 
              type="text" 
              value={textInput} 
              onChange={(e) => setTextInput(e.target.value)} 
              placeholder="Enter your preferences for the form" 
              className="w-full p-3 mt-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg" 
              onClick={onFileUpload}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Upload!'}
            </button>
            {loading ? (
              <div className="flex flex-col items-center mt-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-sm text-gray-600">Getting response from AI...</p>
              </div>
            ) : (
              <div id="ready" className={`mt-6 text-center font-semibold ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Login
          </button>
          {message && (
            <div className={`mt-4 p-3 ${message.includes('failed') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'} border rounded-lg`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;