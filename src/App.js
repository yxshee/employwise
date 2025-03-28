import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import CreateUser from './components/CreateUser';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
