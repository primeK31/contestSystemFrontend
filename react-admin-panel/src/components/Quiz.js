import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Quiz = ({ roomName }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
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
                    const response = await axios.get("https://contestsystembackend.onrender.com/users/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsername(response.data.username);
                    setIsAuthenticated(true);

                    try {
                        const postResponse = await axios.post("https://contestsystembackend.onrender.com/rate/", {
                            "username": response.data.username,
                            "rating": 0,
                            "room_name": roomName
                        });
                        setRating(postResponse.data.rating);
                    } catch (postError) {
                        setIsAuthenticated(false);
                    }

                    try {
                        const getResponse = await axios.get(`https://contestsystembackend.onrender.com/get_room_rating/${roomName}`);
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
            const socket = new WebSocket(`wss://contestsystembackend.onrender.com/ws/room/${roomName}/user/${username}`);
            setWs(socket);

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (Array.isArray(data)) {
                        setRatingList(data);
                    }
                    setAnswers((prevAnswers) => [...prevAnswers, event.data]);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            axios.get(`https://contestsystembackend.onrender.com/rooms/${roomName}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    console.log(response.data);
                    setQuestions(response.data.contests.questions);
                })
                .catch(error => {
                    console.error("There was an error fetching the room!", error);
                });

            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

            return () => {
                socket.close();
            };
        }
    }, [isAuthenticated, username]);

    const handleAnswerOptionClick = async (selectedOption) => {
        if (selectedOption === questions[currentQuestionIndex]?.correct_answer) {
            setScore(score + 1);
            const newRating = rating + 10;
            setRating(newRating);

            try {
                const response = await axios.put('https://contestsystembackend.onrender.com/update_rating/', {
                    username: username,
                    room_name: roomName,
                    rating: newRating
                });

                const updatedRatingList = ratingList.map(item =>
                    item.username === username
                        ? { ...item, rating: newRating }
                        : item
                );
                setRatingList(updatedRatingList);
            } catch (error) {
                console.error('Error updating rating:', error);
            }
        }

        const nextQuestion = currentQuestionIndex + 1;
        if (questions && nextQuestion < questions.length) {
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
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Quiz Component {rating}</h1>
            {!isAuthenticated ? (
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <button 
                        onClick={handleLogin} 
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Ratings</h2>
                        <ul>
                            {ratingList
                                .sort((a, b) => b.rating - a.rating)
                                .map((rating_item, index) => (
                                    <li key={index} className="p-2 mb-2 bg-gray-100 rounded">
                                        User: {rating_item.username}, Rating: {rating_item.rating}
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <button 
                        onClick={submitAnswer} 
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Submit
                    </button>
                    <button 
                        onClick={logout} 
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Logout
                    </button>
                    {showScore ? (
                        <div className="score-section text-center text-xl font-bold">
                            You scored {score} out of {questions?.length || 0}
                        </div>
                    ) : (
                        questions?.length > 0 && (
                            <>
                                <div className="question-section mb-4">
                                    <div className="question-count text-lg font-semibold mb-2">
                                        <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                                    </div>
                                    <div className="question-text text-lg mb-2">
                                        {questions[currentQuestionIndex].question}
                                    </div>
                                </div>
                                <div className="answer-section">
                                    {questions[currentQuestionIndex].options.map((option, index) => (
                                        <button 
                                            onClick={() => handleAnswerOptionClick(option)} 
                                            key={index} 
                                            className="w-full bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mb-2"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default Quiz;
