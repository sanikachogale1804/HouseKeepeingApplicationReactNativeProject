import React, { useState } from 'react';
import axios from 'axios';

function ChangePasswordForm({ userId, onSuccess }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }

        axios.post(`http://localhost:5005/users/${userId}/change-password`, {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        })
        .then(() => {
            alert("Password changed successfully!");
            onSuccess?.();
        })
        .catch((error) => {
            console.error("Error changing password:", error);
            alert("Failed to change password. Please check your current password.");
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Change Password</h3>
            <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
            />
            <button type="submit">Change Password</button>
        </form>
    );
}

export default ChangePasswordForm;
