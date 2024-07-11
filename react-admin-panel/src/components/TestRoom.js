// src/TestRoom.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const TestRoom = ({ roomName }) => {
  const [ws, setWs] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${roomName}`);
    setWs(socket);

    socket.onmessage = (event) => {
      setAnswers((prevAnswers) => [...prevAnswers, event.data]);
    };

    return () => {
      socket.close();
    };
  }, [roomName]);

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
