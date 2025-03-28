import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace with your real API endpoint
        const response = await axios.get(`https://yourapi.example.com/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user.name || !user.email) {
      setError('All fields are required.');
      return;
    }
    try {
      // Replace with your real API endpoint
      await axios.put(`https://yourapi.example.com/users/${id}`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/users');
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit User</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={user.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={user.email} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUser;
