import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/users');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await loginUser(credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/users');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">EmployWise Login</h3>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="eve.holt@reqres.in"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="cityslicka"
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Use credentials: eve.holt@reqres.in / cityslicka
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
