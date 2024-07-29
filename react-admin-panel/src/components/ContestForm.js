import React, { useState } from 'react';
import axios from 'axios';

const ContestForm = ({ onContestCreated }) => {
  const [contestData, setContestData] = useState({
    name: '',
    description: '',
    question_ids: [],
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    image_url: '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    time_limit: 0
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
      [name]: name === 'time_limit' ? parseInt(value) : value
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
    const newQuestion = { ...currentQuestion, id: Date.now().toString() };
    setContestData({
      ...contestData,
      question_ids: [...contestData.question_ids, newQuestion.id],
      questions: [...contestData.questions, newQuestion]
    });
    setCurrentQuestion({
      image_url: '',
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      time_limit: 0
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
        question_ids: [],
        questions: []
      });
      // Notify parent component that a new contest was created
      if (onContestCreated) {
        onContestCreated(response.data);
      }
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Super Contest</h2>
      <form onSubmit={(e) => { e.preventDefault(); createContest(); }} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Contest Name"
            value={contestData.name}
            onChange={handleContestChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={contestData.description}
            onChange={handleContestChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Creating Contest...' : 'Create Contest'}
        </button>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Add Question</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="question"
              placeholder="Question"
              value={currentQuestion.question}
              onChange={handleQuestionChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={option}
                    checked={currentQuestion.correct_answer === option}
                    onChange={handleCorrectAnswerChange}
                    className="mr-2"
                  />
                  Correct
                </label>
              </div>
            ))}
            <div>
              <input type="file" onChange={handleImageUpload} className="mb-2" />
              {currentQuestion.image_url && (
                <img src={currentQuestion.image_url} alt="Question Image" className="max-w-xs mb-2" />
              )}
            </div>
            <input
              type="number"
              name="time_limit"
              placeholder="Time Limit (in seconds)"
              value={currentQuestion.time_limit}
              onChange={handleQuestionChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={addQuestionToContest}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Question to Contest
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Contest Questions</h3>
          <ul className="space-y-2">
            {contestData.questions.map((q, index) => (
              <li key={index}>
                <button
                  onClick={() => showQuestionDetails(q)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  {q.question}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedQuestion && (
          <div className="bg-white p-4 border border-gray-300 rounded">
            <h4 className="text-lg font-semibold mb-2">Question Details</h4>
            <p><strong>Question:</strong> {selectedQuestion.question}</p>
            <p><strong>Options:</strong></p>
            <ul className="list-disc pl-5">
              {selectedQuestion.options.map((option, index) => (
                <li key={index}>
                  {option} {option === selectedQuestion.correct_answer && '(Correct Answer)'}
                </li>
              ))}
            </ul>
            {selectedQuestion.image_url && (
              <img src={selectedQuestion.image_url} alt="Question Image" className="max-w-xs my-2" />
            )}
            <p><strong>Time Limit:</strong> {selectedQuestion.time_limit} seconds</p>
            <button
              onClick={() => setSelectedQuestion(null)}
              className="mt-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Close Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContestForm;