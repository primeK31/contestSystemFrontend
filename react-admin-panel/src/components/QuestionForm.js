import React, { useState } from 'react';
import axios from 'axios';

const QuestionForm = () => {
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (file) {
        // Upload image if present
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await axios.post('https://contestsystembackend.onrender.com/uploadimage/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = uploadResponse.data.image_url;
      }

      // Create question
      const response = await axios.post('https://contestsystembackend.onrender.com/questions/', {
        ...questionData,
        image_url: imageUrl,
      });
      console.log('Question created:', response.data);
    } catch (error) {
      console.error('There was an error creating the question!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" onChange={handleFileChange} />
      <input type="text" name="question" placeholder="Question" value={questionData.question} onChange={handleChange} required />
      {questionData.options.map((option, index) => (
        <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required />
      ))}
      <input type="number" name="correct_answer" placeholder="Correct Answer (0-3)" value={questionData.correct_answer} onChange={handleChange} required />
      <button type="submit">Create Question</button>
    </form>
  );
};

export default QuestionForm;
