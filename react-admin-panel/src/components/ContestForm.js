import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestForm = () => {
  const [questions, setQuestions] = useState([]);
  const [superContestData, setSuperContestData] = useState({
    name: '',
    description: '',
    question_ids: [],
    questions: [],
    time_limit: 0
  });
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingSuperContest, setLoadingSuperContest] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await axios.get('https://contestsystembackend.onrender.com/questions/');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSuperContestChange = (e) => {
    const { name, value } = e.target;
    setSuperContestData({
      ...superContestData,
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
      const response = await axios.post('https://contestsystembackend.onrender.com/uploadimage/', formData);
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
      const response = await axios.post('https://contestsystembackend.onrender.com/questions/', questionData);
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

  const addSuperContest = async () => {
    try {
      setLoadingSuperContest(true);
      const questionObjects = questions.filter(question => superContestData.question_ids.includes(question.question));
      const response = await axios.post('https://contestsystembackend.onrender.com/supercontests/', {
        ...superContestData,
        questions: questionObjects
      });
      console.log('Super Contest created:', response.data);
      setSuperContestData({
        name: '',
        description: '',
        questions: [],
        question_ids: [],
        time_limit: 0
      });
    } catch (error) {
      console.error('Error creating Super Contest:', error);
    } finally {
      setLoadingSuperContest(false);
    }
  };

  const handleQuestionChange = (e) => {
    const { options } = e.target;
    const selectedQuestions = Array.from(options).filter(option => option.selected).map(option => option.value);
    setSuperContestData({
      ...superContestData,
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

      <h2>Create Super Contest</h2>
      <form onSubmit={(e) => { e.preventDefault(); addSuperContest(); }}>
        <input
          type="text"
          name="name"
          placeholder="Super Contest Name"
          value={superContestData.name}
          onChange={handleSuperContestChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={superContestData.description}
          onChange={handleSuperContestChange}
          required
        />
        <select
          multiple={true}
          value={superContestData.question_ids}
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
          value={superContestData.time_limit}
          onChange={handleSuperContestChange}
          required
        />
        <button type="submit" disabled={loadingSuperContest}>{loadingSuperContest ? 'Creating Super Contest...' : 'Create Super Contest'}</button>
      </form>
    </div>
  );
};

export default ContestForm;
