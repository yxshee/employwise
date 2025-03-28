import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, updateUser } from '../services/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUser(id);
      setUser(data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch user details. Please try again.');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
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
      
      await updateUser(id, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });
      
      setSuccess('User updated successfully!');
      
      // Navigate back to user list after a short delay
      timerRef.current = setTimeout(() => {
        navigate('/users');
      }, 1500);
      
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title">Edit User</h3>
                <Link to="/users" className="btn btn-outline-secondary btn-sm">
                  Back to Users
                </Link>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              
              <div className="text-center mb-4">
                <img 
                  src={user.avatar} 
                  alt={`${user.first_name} ${user.last_name}`} 
                  className="rounded-circle img-thumbnail"
                  style={{ width: '120px', height: '120px' }}
                />
              </div>
              
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
                    {submitting ? 'Updating...' : 'Update User'}
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

export default EditUser;
