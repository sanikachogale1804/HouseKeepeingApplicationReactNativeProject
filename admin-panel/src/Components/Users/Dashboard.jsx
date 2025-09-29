import React, { useState, useEffect } from 'react';
import logo from '../Images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

import '../CSS/AdminPanel.css';
import '../CSS/Dashboard.css';

import Api_link from '../Config/apiconfig';

function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${Api_link}/floorData/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      // Local today date
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;

      // Filter all images for today
      const todayImages = data.filter(img => img.taskImage?.includes(todayStr));

      setImages(todayImages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchImages();
  }, []);

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
          <li><Link className="sidebar-link" to="/report">Report</Link></li>
        </ul>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h2>Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-image-section">
          <h3>Floor List with Images</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="floor-image-table">
              <thead>
                <tr>
                  <th>Floor Name</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {floorOptionsEn.map((floor, index) => {
                  const floorImages = images.filter(
                    (img) => img.floorName.replace(/_/g, ' ') === floor
                  );

                  return (
                    <tr key={index}>
                      <td>{floor}</td>
                      <td>
                        {floorImages.length > 0 ? (
                          <div className="floor-image-row">
                            {floorImages.map((img) => (
                              <div key={img.id} className="image-item">
                                <img
                                  src={`${Api_link}/floorData/${img.id}/image`}
                                  alt={img.taskImage}
                                  className="floor-thumbnail"
                                  onClick={() =>
                                    setPreviewImage(`${Api_link}/floorData/${img.id}/image`)
                                  }
                                />
                                <span className="image-label">{img.taskImage}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="no-image">No images</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

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
