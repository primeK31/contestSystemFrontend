import React, { useState, useEffect } from 'react';
import axios from 'axios';


const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8000/users/');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
