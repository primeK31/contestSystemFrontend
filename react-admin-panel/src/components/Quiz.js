import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = ({roomName}) => {
    const [questions, setQuestions] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [contest, setContests] = useState([]);
    const [newQuestions, setNewQuestions] = useState([]);

    const [ws, setWs] = useState(null);
    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/user/username`);
        setWs(socket);
    
        socket.onmessage = (event) => {
          setAnswers((prevAnswers) => [...prevAnswers, event.data]);
        };

        axios.get('http://localhost:8000/questions')
        .then(response => {
            console.log(response.data);
            setQuestions(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the questions!", error);
        });

        axios.get(`http://localhost:8000/rooms/${roomName}`)
        .then(response => {
            console.log(response.data);
            setQuestionList(response.data.contests.question_ids);
        })
        .catch(error => {
            console.error("There was an error fetching the questions!", error);
        });
    
        return () => {
          socket.close();
        };
      }, [roomName]);

    useEffect(() => {
        //console.log(questionList);
        let newList = [];
        for (let name of questionList) {
            for (let question of questions) {
                if(name === question.question) {
                    newList.push(question);
                }
            }
        }
        console.log(newList);
        setNewQuestions(newList);
    }, [questions, questionList]);

    const handleAnswerOptionClick = (selectedOption) => {
        console.log(contest[0]);
        if (selectedOption === newQuestions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
        }
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < newQuestions.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    return (
        <div className="quiz">
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
        </div>
    );
};

export default Quiz;
