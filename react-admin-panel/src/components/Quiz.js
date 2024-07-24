import React, { useState, useEffect, useRef } from 'react';
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [answer, setAnswer] = useState('');
    const [rating, setRating] = useState('');
    const [ratingList, setRatingList] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);

    const timerRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);

    const [userSelectedOptions, setUserSelectedOptions] = useState([]);


    useEffect(() => {
        const fetchMessages = async () => {
            const result = await axios.get(`http://localhost:8000/messages/${roomName}`);
            setMessages(result.data);
        };
    
        fetchMessages();
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() && username.trim()) {
            const msg = {
                username: username,
                content: message,
                room_name: roomName
            };
            console.log(msg);
            console.log(JSON.stringify(msg));
            await axios.post('http://localhost:8000/messages/', msg);
            setMessage('');
        }
    };

    const submitUserAnswer = async (selectedOption) => {
        try {
            const now = new Date();
            const submission = {
                username: username,
                room_name: roomName,
                question_name: questions[currentQuestionIndex].question,
                selected_option: selectedOption,
                is_correct: questions[currentQuestionIndex].correct_answer === selectedOption,
                submitted_at: now
            };
            console.log(submission)

            const response = await axios.post('http://localhost:8000/submissions/', submission);
            console.log('Submission response:', response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
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
                            username: response.data.username,
                            rating: 0,
                            room_name: roomName
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
    }, [roomName]);

    useEffect(() => {
        if (isAuthenticated) {
            const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/user/${username}`);
            setWs(socket);

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (Array.isArray(data)) {
                        setRatingList(data);
                    } else if (data.username && data.content) {
                        setMessages((prevMessages) => [...prevMessages, data]);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            const token = localStorage.getItem('access_token');
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
    }, [isAuthenticated, username, roomName]);

    const handleAnswerOptionClick = async (selectedOption) => {
        setShowingCorrectAnswer(true);
        setTimeLeft(10);

        setUserSelectedOptions(prevOptions => [
            ...prevOptions, 
            { 
                questionIndex: questions[currentQuestionIndex].question,
                selectedOption: selectedOption,
                correctOption: questions[currentQuestionIndex].correct_answer
            }
        ]);

        await submitUserAnswer(selectedOption);

        if (selectedOption === questions[currentQuestionIndex]?.correct_answer) {
            setScore(score + 1);
            const newRating = rating + 10;
            setRating(newRating);

            try {
                await axios.put('https://contestsystembackend.onrender.com/update_rating/', {
                    username,
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

        setTimeout(() => {
            setShowingCorrectAnswer(false);
            const nextQuestion = currentQuestionIndex + 1;
            if (questions && nextQuestion < questions.length) {
                setCurrentQuestionIndex(nextQuestion);
                resetTimer();
            } else {
                setShowScore(true);
            }
        }, 2000);
    };

    const submitAnswer = () => {
        if (ws && answer) {
            ws.send(JSON.stringify({ answer, username, room_name: roomName }));
            setAnswer('');
        }
    };

    useEffect(() => {
        if (currentQuestionIndex < questions.length) {
            timerRef.current = setTimeout(() => {
                const nextQuestion = currentQuestionIndex + 1;
                if (questions && nextQuestion < questions.length) {
                    setCurrentQuestionIndex(nextQuestion);
                    resetTimer();
                } else {
                    setShowScore(true);
                }
            }, 10000);

            return () => {
                clearTimeout(timerRef.current);
            };
        }
    }, [currentQuestionIndex, questions.length]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            setShowingCorrectAnswer(true);
            setTimeout(() => {
                setShowingCorrectAnswer(false);
                handleNextQuestion();
            }, 5000);
        }
    }, [timeLeft]);

    const resetTimer = () => {
        setTimeLeft(10);
    };

    const handleNextQuestion = () => {
        clearTimeout(timerRef.current);
        const nextQuestion = currentQuestionIndex + 1;
        if (questions && nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
            resetTimer();
        } else {
            setShowScore(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        setUsername('');
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Quiz Component {rating}</h1>
            {!isAuthenticated ? (
                <div className="mb-4">
                    <div>Please log in to access the quiz.</div>
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
                        onClick={handleLogout} 
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
                                        <img src={questions[currentQuestionIndex]?.image_url} alt={questions[currentQuestionIndex]?.image_url} />
                                        <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
                                    </div>
                                    <div className="question-text text-lg font-semibold mb-2">
                                        {questions[currentQuestionIndex]?.question}
                                    </div>
                                </div>
                        <div className="answer-section mb-4">
                            {questions[currentQuestionIndex]?.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerOptionClick(option)}
                                    className={`w-full font-bold py-2 px-4 rounded mb-2 ${
                                        showingCorrectAnswer
                                            ? option === questions[currentQuestionIndex].correct_answer
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            : 'bg-blue-500 hover:bg-blue-700 text-white'
                                    }`}
                                    disabled={showingCorrectAnswer}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {showingCorrectAnswer && (
                            <div className="correct-answer text-lg font-semibold mb-2 text-green-600">
                                Correct Answer: {questions[currentQuestionIndex].correct_answer}
                            </div>
                        )}
                        {!showingCorrectAnswer && (
                            <div className="timer text-lg font-semibold mb-2">
                                Time left: {timeLeft} seconds
                            </div>
                        )}
                            </>
                        )
                    )}
                    <div className="chat-section">
                <h2 className="text-xl font-semibold mb-4">Chat</h2>
                <div className="messages mb-4">
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${msg.username}: ${msg.content}`} />
                        </ListItem>
                    ))}
                </List>
                </div>
                <div className="send-message">
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                                e.preventDefault();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        className="mt-2"
                    >
                        Send
                    </Button>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
