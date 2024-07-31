import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';


const Quiz = () => {

    const { roomName } = useParams();

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
            const result = await axios.get(`https://contestsystembackend.onrender.com/messages/${roomName}`);
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
            await axios.post('https://contestsystembackend.onrender.com/messages/', msg);
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

            const response = await axios.post('https://contestsystembackend.onrender.com/submissions/', submission);
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
            const socket = new WebSocket(`wss://contestsystembackend.onrender.com/ws/room/${roomName}/user/${username}`);
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
                    console.log(response.data.contest_name);
                    axios.get(`https://contestsystembackend.onrender.com/supercontests/${response.data.contest_name}`)
                    .then(res => {
                    console.log(res.data);
                    setQuestions(res.data.questions);
                })
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
            setShowingCorrectAnswer(true);

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
    };

    const submitAnswer = () => {
        if (ws && answer) {
            ws.send(JSON.stringify({ answer, username, room_name: roomName }));
            setAnswer('');
        }
    };

    useEffect(() => {
        if (currentQuestionIndex < questions.length) {
            if (timeLeft > 0) {
                const timerId = setTimeout(() => {
                    setTimeLeft(timeLeft - 1);
                }, 1000);
                return () => clearTimeout(timerId);
            } else if (!showingCorrectAnswer) {
                setShowingCorrectAnswer(true);
                setTimeout(() => {
                    handleNextQuestion();
                }, 5000);
            }
        }
    }, [timeLeft, currentQuestionIndex, questions.length, showingCorrectAnswer]);

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
        setShowingCorrectAnswer(false);
        const nextQuestion = currentQuestionIndex + 1;
        if (questions && nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
            setTimeLeft(20);
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
        <div className="min-h-screen flex flex-col md:flex-row">
            {!isAuthenticated ? (
                <div className="w-full flex items-center justify-center p-4">
                    <div className="text-lg text-gray-700">Please log in to access the quiz.</div>
                </div>
            ) : (
                <>
                    <div className="w-full md:w-1/2 p-4 bg-white overflow-y-auto">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-600">Quiz Challenge</h1>
                        {showScore ? (
                            <div className="text-center text-xl md:text-2xl font-bold text-indigo-600 bg-indigo-100 p-4 rounded-lg">
                                You scored {score} out of {questions?.length || 0}
                            </div>
                        ) : (
                            questions?.length > 0 && (
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <div className="mb-4">
                                        <div className="text-base md:text-lg font-semibold mb-2 text-indigo-600">
                                            Question {currentQuestionIndex + 1}/{questions.length}
                                        </div>
                                        {questions[currentQuestionIndex]?.image_url && (
                                            <img 
                                                src={questions[currentQuestionIndex].image_url} 
                                                alt="Question" 
                                                className="w-full max-h-48 md:max-h-64 object-contain mb-4 rounded-lg"
                                            />
                                        )}
                                        <div className="text-lg md:text-xl font-semibold mb-4">
                                            {questions[currentQuestionIndex]?.question}
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswerOptionClick(option)}
                                                className={`w-full py-2 px-3 rounded-lg font-medium text-sm md:text-base transition duration-300 ${
                                                    showingCorrectAnswer
                                                        ? option === questions[currentQuestionIndex].correct_answer
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-red-500 text-white'
                                                        : 'bg-white hover:bg-indigo-100 text-indigo-700'
                                                }`}
                                                disabled={showingCorrectAnswer}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {showingCorrectAnswer && (
                                        <div className="text-base md:text-lg font-semibold mb-4 text-green-600 bg-green-100 p-3 rounded-lg">
                                            Correct Answer: {questions[currentQuestionIndex].correct_answer}
                                        </div>
                                    )}
                                    <div className="text-base md:text-lg font-semibold mb-4 text-indigo-600">
                                        Time left: {timeLeft} seconds
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Leaderboard and Chat Section */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        {/* Leaderboard */}
                        <div className="h-1/2 p-4 bg-gray-100 overflow-y-auto">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Leaderboard</h2>
                            <ul className="space-y-2">
                                {ratingList
                                    .sort((a, b) => b.rating - a.rating)
                                    .map((rating_item, index) => (
                                        <li key={index} className="flex justify-between items-center p-2 md:p-3 bg-white rounded-md shadow">
                                            <span className="font-medium text-sm md:text-base">{rating_item.username}</span>
                                            <span className="bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full text-xs md:text-sm">{rating_item.rating}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Chat */}
                        <div className="h-1/2 p-4 bg-white flex flex-col">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-600">Chat</h2>
                            <div className="flex-grow bg-gray-100 rounded-lg p-3 mb-4 overflow-y-auto">
                                <List>
                                    {messages.map((msg, index) => (
                                        <ListItem key={index} className="mb-2 bg-white rounded-lg shadow-sm">
                                            <ListItemText 
                                                primary={msg.username} 
                                                secondary={msg.content}
                                                primaryTypographyProps={{ className: "font-semibold text-indigo-600 text-sm md:text-base" }}
                                                secondaryTypographyProps={{ className: "text-gray-700 text-xs md:text-sm" }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                            <div className="flex space-x-2">
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
                                    className="bg-white"
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSendMessage}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    size="small"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
