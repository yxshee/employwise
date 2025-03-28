import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your real API endpoint
        const response = await axios.get('https://yourapi.example.com/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-5">
      <h2>User List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search users..."
          className="form-control"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {filteredUsers.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name}
            <Link to={`/edit/${user.id}`} className="btn btn-sm btn-outline-secondary">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
