import React, { useState } from 'react';
import logo from '../Images/logo.png';
import { Link } from 'react-router-dom';
import '../CSS/AdminPanel.css';
import '../CSS/Dashboard.css'; // NEW DASHBOARD-SPECIFIC STYLES

function Dashboard() {
  const [selectedSubfloor, setSelectedSubfloor] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // for modal

  const subfloors = [
    'East Lobby Area', 'West Lobby Area', 'Washroom', 'Common Area',
    'Back Tericota', 'Marble Tericota', 'Meeting Room', 'Conference Room', 'Pantry Area',
  ];

  const getSuffix = (n) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return `${n}st`;
    if (j === 2 && k !== 12) return `${n}nd`;
    if (j === 3 && k !== 13) return `${n}rd`;
    return `${n}th`;
  };

  const floorOptionsEn = [
    'Basement 2',
    'Basement 1',
    'Ground Floor',
    'MZ Floor',
    ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
  ];

  const fetchImages = async () => {
    if (!selectedSubfloor) {
      alert('Please select a Subfloor.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated. Please login.');
        return;
      }

      const encodedSubfloor = encodeURIComponent(selectedSubfloor);
      const response = await fetch(
        `http://localhost:5005/floorData/images?subFloorName=${encodedSubfloor}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to fetch images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        <h2>Fetch Images by Subfloor</h2>

        <div className="dashboard-controls">
          <select onChange={(e) => setSelectedSubfloor(e.target.value)} value={selectedSubfloor}>
            <option disabled value="">-- Select Subfloor --</option>
            {subfloors.map((sub, i) => (
              <option key={i}>{sub}</option>
            ))}
          </select>

          <button onClick={fetchImages} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Images'}
          </button>
        </div>

        <div className="dashboard-image-section">
          <h3>Floor List with Images ({selectedSubfloor || 'None'})</h3>
          <ul className="dashboard-floor-list">
            {floorOptionsEn.map((floor, index) => {
              const floorImages = images.filter(
                (img) =>
                  img.floorName === floor &&
                  img.subFloorName === selectedSubfloor
              );

              return (
                <li key={index}>
                  <div className="floor-image-group">
                    <div className="floor-name">{floor}</div>
                    {floorImages.length > 0 ? (
                      floorImages.map((img) => (
                        <img
                          key={img.id}
                          src={`http://localhost:5005/floorData/${img.id}/image`}
                          alt={img.taskImage}
                          className="floor-thumbnail"
                          onClick={() =>
                            setPreviewImage(`http://localhost:5005/floorData/${img.id}/image`)
                          }
                        />
                      ))
                    ) : (
                      <div className="no-image">No images</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Modal Preview */}
        {previewImage && (
          <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
            <img src={previewImage} alt="Full View" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
