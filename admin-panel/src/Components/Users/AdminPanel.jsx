import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateUserForm from './UpdateUserForm';
import '../CSS/AdminPanel.css';
import logo from '../Images/logo.png';
import { Link } from 'react-router-dom'; // Add this at the top

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', userPassword: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5005/users')
      .then(response => {
        const embeddedUsers = response.data._embedded?.users || [];
        setUsers(embeddedUsers);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5005/register', newUser)
      .then(() => {
        alert("User Added Successfully!");
        setNewUser({ username: '', userPassword: '', role: '' });
        fetchUsers();
      })
      .catch(error => {
        console.error("Error adding user:", error);
      });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    fetchUsers();
  };

 const filteredUsers = users.filter(user =>
  user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (selectedRole === '' || user.role.toLowerCase() === selectedRole.toLowerCase())
);


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="admin-title">Admin Panel</div>
        <ul className="sidebar-links">
          <li><Link className="sidebar-link" to="/dashboard">Dashboard</Link></li>
          <li><Link className="sidebar-link" to="/admin">User Management</Link></li>
        </ul>
      </div>

      {/* Main Panel */}
      <div className="dashboard-container" style={{ marginLeft: '260px', padding: '20px' }}>
        <div className="admin-header-buttons">
        </div>

        <div className="controls-container">
          <div className="filter-search-container">
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="HOUSEKEEPER">Housekeeper</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
          </div>

          <form onSubmit={handleAddUser} className="assign-ticket-container" style={{ marginTop: '10px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="userPassword"
              placeholder="Password"
              value={newUser.userPassword}
              onChange={handleInputChange}
              required
            />
            <select name="role" value={newUser.role} onChange={handleInputChange} required>
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="HOUSEKEEPER">Housekeeper</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
            <button type="submit">Add User</button>
          </form>
        </div>

        <div className="ticket-list-container">
          <h3>User List</h3>

          {editingUser ? (
            <UpdateUserForm user={editingUser} onSuccess={handleEditSuccess} />
          ) : filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      <span className={`status-label ${user.role.toLowerCase()}`}>{user.role}</span>
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
