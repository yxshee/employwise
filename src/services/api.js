import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL ? 
  `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api` : 
  '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token when available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (page = 1) => {
  try {
    const response = await apiClient.get(`/users?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;

