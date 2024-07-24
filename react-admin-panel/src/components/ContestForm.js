import React, { useState } from 'react';
import axios from 'axios';

const ContestForm = () => {
  const [contestData, setContestData] = useState({
    name: '',
    description: '',
    questions: [],
    time_limit: 0
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleContestChange = (e) => {
    const { name, value } = e.target;
    setContestData({
      ...contestData,
      [name]: value
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleCorrectAnswerChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      correct_answer: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const response = await axios.post('https://contestsystembackend.onrender.com/uploadimage/', formData);
      setCurrentQuestion({
        ...currentQuestion,
        image_url: response.data.image_url
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addQuestionToContest = () => {
    setContestData({
      ...contestData,
      questions: [...contestData.questions, currentQuestion]
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      image_url: ''
    });
  };

  const createContest = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://contestsystembackend.onrender.com/supercontests/', contestData);
      console.log('Contest created:', response.data);
      setContestData({
        name: '',
        description: '',
        questions: [],
        time_limit: 0
      });
    } catch (error) {
      console.error('Error creating contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const showQuestionDetails = (question) => {
    setSelectedQuestion(question);
  };

  return (
    <div>
      <h2>Create Contest</h2>
      <form onSubmit={(e) => { e.preventDefault(); createContest(); }}>
        <input
          type="text"
          name="name"
          placeholder="Contest Name"
          value={contestData.name}
          onChange={handleContestChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={contestData.description}
          onChange={handleContestChange}
          required
        />
        <input
          type="number"
          name="time_limit"
          placeholder="Time Limit (in minutes)"
          value={contestData.time_limit}
          onChange={handleContestChange}
          required
        />

        <h3>Add Question</h3>
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={currentQuestion.question}
          onChange={handleQuestionChange}
          required
        />
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            <label>
              <input
                type="radio"
                name="correct_answer"
                value={option}
                checked={currentQuestion.correct_answer === option}
                onChange={handleCorrectAnswerChange}
                required
              />
              Correct Answer
            </label>
          </div>
        ))}
        <input type="file" onChange={handleImageUpload} />
        {currentQuestion.image_url && (
          <img src={currentQuestion.image_url} alt="Question Image" style={{ maxWidth: '200px' }} />
        )}
        <button type="button" onClick={addQuestionToContest}>Add Question to Contest</button>

        <h3>Contest Questions</h3>
        <ul>
          {contestData.questions.map((q, index) => (
            <li key={index}>
              <button onClick={() => showQuestionDetails(q)}>{q.question}</button>
            </li>
          ))}
        </ul>

        {selectedQuestion && (
          <div>
            <h4>Question Details</h4>
            <p><strong>Question:</strong> {selectedQuestion.question}</p>
            <p><strong>Options:</strong></p>
            <ul>
              {selectedQuestion.options.map((option, index) => (
                <li key={index}>{option} {option === selectedQuestion.correct_answer && '(Correct Answer)'}</li>
              ))}
            </ul>
            {selectedQuestion.image_url && (
              <img src={selectedQuestion.image_url} alt="Question Image" style={{ maxWidth: '200px' }} />
            )}
            <button onClick={() => setSelectedQuestion(null)}>Close Details</button>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Contest...' : 'Create Contest'}
        </button>
      </form>
    </div>
  );
};

export default ContestForm;