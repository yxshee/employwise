import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import UserEditModal from './UserEditModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { logout } = useContext(AuthContext);

  // Memoize fetchUsers function to satisfy eslint-exhaustive-deps and avoid extra rendering
  const fetchUsers = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        toast.error('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowEditModal(false);
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="my-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Users</h1>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">Loading users...</div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredUsers.map(user => (
              <Col key={user.id}>
                <Card>
                  <Card.Img variant="top" src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                  <Card.Body>
                    <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                    <Card.Text>{user.email}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={() => handleEdit(user)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center mt-4">
            {renderPagination()}
          </div>
        </>
      )}

      {showEditModal && (
        <UserEditModal
          user={currentUser}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </Container>
  );
};

export default UserList;
