import React, { useState } from 'react';
import axios from 'axios';

function UpdateUserForm({ user, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        userPassword: '',
        role: user.role || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const extractIdFromHref = (href) => {
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const userId = extractIdFromHref(user._links.self.href);

        axios.put(`http://localhost:5005/users/${userId}`, formData)
            .then(() => {
                alert("User updated successfully!");
                onSuccess();
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                alert("Failed to update user");
            });
    };

    return (
        <form onSubmit={handleUpdate} style={{ marginBottom: '20px' }}>
            <h3>Edit User</h3>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="userPassword"
                placeholder="New Password"
                value={formData.userPassword}
                onChange={handleChange}
            />
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
            >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="HOUSEKEEPER">Housekeeper</option>
                <option value="SUPERVISOR">Supervisor</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
                Cancel
            </button>
        </form>
    );
}

export default UpdateUserForm;
