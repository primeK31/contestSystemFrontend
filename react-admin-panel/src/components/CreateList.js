import React, { useState } from 'react';
import axios from 'axios';


const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('https://contestsystembackend.onrender.com/users/', { username, email });
    setUsername('');
    setEmail('');
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateUser;
