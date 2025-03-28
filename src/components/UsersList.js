import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';
import { Container, Table, Button, Pagination, Form, InputGroup, Alert, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const fetchUsers = async (page) => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers(page);
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);
  
  const handleEdit = (id) => {
    navigate(`/users/${id}/edit`);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        setSuccess('User deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>EmployWise</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container className="mt-4">
        <h2 className="mb-4">Users Management</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <img src={user.avatar} alt={user.first_name} className="user-avatar" />
                    </td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(user.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item 
                  key={i + 1} 
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
};

export default UsersList;
