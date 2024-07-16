import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Quiz = ({ roomName }) => {
    const [questions, setQuestions] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [newQuestions, setNewQuestions] = useState([]);
    const [ws, setWs] = useState(null);
    const [answers, setAnswers] = useState([]);
    const { token, login, logout } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [answer, setAnswer] = useState('');
    const [rating, setRating] = useState('');
    const [ratingList, setRatingList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const response = await axios.get("http://localhost:8000/users/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsername(response.data.username);
                    setIsAuthenticated(true);

                    try {
                        const postResponse = await axios.post("http://localhost:8000/rate/", {
                            "username": response.data.username,
                            "rating": 0,
                            "room_name": roomName
                        });
                        setRating(postResponse.data.rating);
                    } catch (postError) {
                        setIsAuthenticated(false);
                    }

                    try {
                        const getResponse = await axios.get(`http://localhost:8000/get_room_rating/${roomName}`);
                        console.log(getResponse.data);
                        setRatingList(getResponse.data);
                    } catch (postError) {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchData();
    }, [token, roomName]);

    useEffect(() => {
        if (isAuthenticated) {
            const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/user/${username}`);
            setWs(socket);

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (Array.isArray(data)) {
                        setRatingList(data);
                    } else {
                        setAnswers((prevAnswers) => [...prevAnswers, event.data]);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            axios.get('http://localhost:8000/questions', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setQuestions(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the questions!", error);
                });

            axios.get(`http://localhost:8000/rooms/${roomName}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setQuestionList(response.data.contests.question_ids);
                })
                .catch(error => {
                    console.error("There was an error fetching the room!", error);
                });

            return () => {
                socket.close();
            };
        }
    }, [isAuthenticated, username]);

    useEffect(() => {
        let newList = [];
        for (let name of questionList) {
            for (let question of questions) {
                if (name === question.question) {
                    newList.push(question);
                }
            }
        }
        setNewQuestions(newList);
    }, [questions, questionList]);

    const handleAnswerOptionClick = async (selectedOption) => {
        if (selectedOption === newQuestions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
            const newRating = rating + 10;
            setRating(newRating);
            try {
                const response = await axios.put('http://localhost:8000/update_rating/', {
                    username: username,
                    room_name: roomName,
                    rating: newRating
                });

                /*const updatedRatingList = ratingList.map(item =>
                    item.username === username
                        ? { ...item, rating: newRating }
                        : item
                );
                setRatingList(updatedRatingList);*/
            } catch (error) {
                console.error('Error updating rating:', error);
            }
        }

        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < newQuestions.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    const submitAnswer = () => {
        if (ws && answer) {
          ws.send(answer);
          setAnswer('');
        }
      };

    const handleLogin = async () => {
        await login(username, password);
    };

    return (
        <div className="quiz">
            <h1>Quiz Component {rating}</h1>
            {!isAuthenticated ? (
                <div>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <>
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
        <div>
            <h2>Ratings</h2>
            <ul>
                {ratingList.map((rating_item, index) => (
                    <li key={index}>
                        User: {rating_item.username},  Rating: {rating_item.rating}
                    </li>
                ))}
            </ul>
        </div>
      <Button variant="contained" color="primary" onClick={submitAnswer}>
        Submit
      </Button>
                    <button onClick={logout}>Logout</button>
                    {showScore ? (
                        <div className="score-section">
                            You scored {score} out of {newQuestions.length}
                        </div>
                    ) : (
                        <>
                            {newQuestions.length > 0 && (
                                <>
                                    <div className="question-section">
                                        <div className="question-count">
                                            <span>Question {currentQuestionIndex + 1}</span>/{newQuestions.length}
                                        </div>
                                        <div className="question-text">
                                            {newQuestions[currentQuestionIndex].question}
                                        </div>
                                    </div>
                                    <div className="answer-section">
                                        {newQuestions[currentQuestionIndex].options.map((option, index) => (
                                            <button onClick={() => handleAnswerOptionClick(option)} key={index}>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Quiz;
