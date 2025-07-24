import React, { useState } from 'react';
import axios from 'axios';

function UpdateUserForm({ user, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        userPassword: '',
        confirmPassword: '',
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
        if (formData.userPassword && formData.userPassword !== formData.confirmPassword) {
            alert("Password and confirm password do not match");
            return;
        }

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

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${formData.username}?`);
        if (!confirmDelete) return;

        try {
            const userId = extractIdFromHref(user._links.self.href); // 💡 FIX HERE
            await axios.delete(`http://localhost:5005/users/${userId}`);
            alert("User deleted successfully.");
            onSuccess(); // Refresh user list or close modal
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Make sure you're authorized.");
        }
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
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
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
            <button
                type="button" // <-- Important! Prevents form submission
                onClick={handleDelete}
                style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px"
                }}
            >
                Delete User
            </button>

        </form>
    );
}

export default UpdateUserForm;
