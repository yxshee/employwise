import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://reqres.in/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user details.');
        toast.error('Error loading user data');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchUser();
  }, [id, logout, navigate]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user.first_name || !user.last_name || !user.email) {
      setError('All fields are required.');
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('User updated successfully');
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError('Failed to update user.');
      toast.error('Error updating user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title">Edit User</h2>
                <Link to="/users" className="btn btn-outline-secondary">Back to List</Link>
              </div>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-4 text-center">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={`${user.first_name} ${user.last_name}`} 
                        className="img-fluid rounded-circle mb-3" 
                        style={{ maxWidth: '150px' }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        name="first_name" 
                        className="form-control" 
                        value={user.first_name} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        name="last_name" 
                        className="form-control" 
                        value={user.last_name} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        className="form-control" 
                        value={user.email} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
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
