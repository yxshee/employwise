import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api/axios';

const UserEditModal = ({ user, show, onHide, onUpdate }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      setError('All fields are required');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await api.put(`/api/users/${user.id}`, {
        first_name: firstName,
        last_name: lastName,
        email
      });
      
      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
        email
      };
      
      onUpdate(updatedUser);
      toast.success('User updated successfully');
    } catch (error) {
      setError('Failed to update user');
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserEditModal;
