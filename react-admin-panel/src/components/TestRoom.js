import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from './AuthContext'; // Ensure this is the correct path
import axios from 'axios';

const TestRoom = ({ roomName }) => {
  const [ws, setWs] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
        axios.get("https://contestsystembackend.onrender.com/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setUsername(response.data.username);
            setIsAuthenticated(true);
        }).catch(() => {
            setIsAuthenticated(false);
        });
    }
}, [token]);

  useEffect(() => {
    if (username && isAuthenticated) {
      const socket = new WebSocket(`wss://contestsystembackend.onrender.com/ws/room/${roomName}/user/${username}`);
      setWs(socket);

      socket.onmessage = (event) => {
        setAnswers((prevAnswers) => [...prevAnswers, event.data]);
      };

      return () => {
        socket.close();
      };
    }
  }, [roomName, username, isAuthenticated]);

  const submitAnswer = () => {
    if (ws && answer) {
      ws.send(answer);
      setAnswer('');
    }
  };

  return (
    <div>
      <List>
        {answers.map((ans, index) => (
          <ListItem key={index}>
            <ListItemText primary={ans} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            submitAnswer();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={submitAnswer}>
        Submit
      </Button>
    </div>
  );
};

export default TestRoom;
