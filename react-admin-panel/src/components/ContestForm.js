import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestForm = () => {
  const [questions, setQuestions] = useState([]);
  const [contestData, setContestData] = useState({
    name: '',
    description: '',
    question_ids: [],
    time_limit: 0
  });
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingContest, setLoadingContest] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await axios.get('http://localhost:8000/questions/');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleContestChange = (e) => {
    const { name, value } = e.target;
    setContestData({
      ...contestData,
      [name]: value
    });
  };

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions
    });
  };

  const handleCorrectAnswerChange = (e) => {
    setQuestionData({
      ...questionData,
      correct_answer: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const response = await axios.post('http://localhost:8000/uploadimage/', formData);
      setQuestionData({
        ...questionData,
        image_url: response.data.image_url
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:8000/questions/', questionData);
      console.log('Question created:', response.data);
      setQuestions([...questions, response.data]);
      setQuestionData({
        question: '',
        options: ['', '', '', ''],
        correct_answer: ''
      });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const addContest = async () => {
    try {
      setLoadingContest(true);
      const response = await axios.post('http://localhost:8000/contests/', contestData);
      console.log('Contest created:', response.data);
      setContestData({
        name: '',
        description: '',
        question_ids: [],
        time_limit: 0
      });
    } catch (error) {
      console.error('Error creating contest:', error);
    } finally {
      setLoadingContest(false);
    }
  };

  const handleQuestionChange = (e) => {
    const { options } = e.target;
    const selectedQuestions = Array.from(options).filter(option => option.selected).map(option => option.value);
    setContestData({
      ...contestData,
      question_ids: selectedQuestions
    });
  };

  return (
    <div>
      <h2>Create Question</h2>
      <form>
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={questionData.question}
          onChange={handleQuestionInputChange}
          required
        />
        {questionData.options.map((option, index) => (
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
                checked={questionData.correct_answer === option}
                onChange={handleCorrectAnswerChange}
                required
              />
              Correct Answer
            </label>
          </div>
        ))}
        <input type="file" onChange={handleImageUpload} />
        {questionData.image_url && (
          <img src={questionData.image_url} alt="Question Image" style={{ maxWidth: '200px' }} />
        )}
        <button type="button" onClick={addQuestion}>Add Question</button>
      </form>

      <hr />

      <h2>Create Contest</h2>
      <form onSubmit={(e) => { e.preventDefault(); addContest(); }}>
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
        <select
          multiple={true}
          value={contestData.question_ids}
          onChange={handleQuestionChange}
          required
        >
          {loadingQuestions ? (
            <option>Loading questions...</option>
          ) : (
            questions.map(question => (
              <option key={question.id} value={question.id}>
                {question.question}
              </option>
            ))
          )}
        </select>
        <input
          type="number"
          name="time_limit"
          placeholder="Time Limit (in minutes)"
          value={contestData.time_limit}
          onChange={handleContestChange}
          required
        />
        <button type="submit" disabled={loadingContest}>{loadingContest ? 'Creating Contest...' : 'Create Contest'}</button>
      </form>
    </div>
  );
};

export default ContestForm;