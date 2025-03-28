import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../services/api';

const CreateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!user.first_name || !user.last_name || !user.email) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      await createUser(user);
      navigate('/users');
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Create error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title">Create User</h3>
                <Link to="/users" className="btn btn-outline-secondary btn-sm">
                  Back to Users
                </Link>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
