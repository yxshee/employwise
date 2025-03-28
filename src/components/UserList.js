import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const data = await getUsers(page);
      setUsers(data.data);
      setFilteredUsers(data.data);
      setTotalPages(data.total_pages);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        // Remove user from state
        setUsers(users.filter(user => user.id !== id));
        setFilteredUsers(filteredUsers.filter(user => user.id !== id));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <div>
          <Link to="/create" className="btn btn-success me-2">Add User</Link>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Avatar</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <img 
                              src={user.avatar} 
                              alt={`${user.first_name} ${user.last_name}`} 
                              className="rounded-circle"
                              width="40"
                            />
                          </td>
                          <td>{`${user.first_name} ${user.last_name}`}</td>
                          <td>{user.email}</td>
                          <td>
                            <Link to={`/edit/${user.id}`} className="btn btn-sm btn-primary me-2">
                              Edit
                            </Link>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <nav aria-label="User pagination">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <li 
                      key={index} 
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
