import React, { useState, useEffect } from 'react';
import Api_link from '../Config/apiconfig';

function Supervisor() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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

            // Filter images only for today
            const todayImages = data.filter((img) =>
                img.taskImage?.includes(todayStr)
            );

            setImages(todayImages);
        } catch (err) {
            console.error("Error fetching images:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${Api_link}/floorData/${id}/approve`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update state instead of removing
            setImages((prev) =>
                prev.map((img) =>
                    img.id === id ? { ...img, approved: true } : img
                )
            );

            alert("✅ Image Approved Successfully!");
        } catch (err) {
            console.error("Error approving image:", err);
            alert("❌ Error approving image");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="supervisor-container">
            <h2>Supervisor Dashboard</h2>

            <div className="supervisor-image-section">
                <h3>Floor List with Today's Images</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="floor-image-table">
                        <thead>
                            <tr>
                                <th>Floor Name</th>
                                <th>Approved Images</th>
                                <th>Pending Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {floorOptionsEn.map((floor, index) => {
                                const floorImages = images.filter(
                                    (img) => img.floorName.replace(/_/g, ' ') === floor
                                );

                                const approvedImages = floorImages.filter(img => img.approved);
                                const pendingImages = floorImages.filter(img => !img.approved);

                                return (
                                    <tr key={index}>
                                        <td>{floor}</td>

                                        {/* Approved Images */}
                                        <td>
                                            {approvedImages.length > 0 ? (
                                                <div className="floor-image-row">
                                                    {approvedImages.map((img) => (
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
                                                            <span className="approved-label">✅ Approved</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="no-image">No approved images</span>
                                            )}
                                        </td>

                                        {/* Pending Images */}
                                        <td>
                                            {pendingImages.length > 0 ? (
                                                <div className="floor-image-row">
                                                    {pendingImages.map((img) => (
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
                                                            <button
                                                                className="approve-btn"
                                                                onClick={() => handleApprove(img.id)}
                                                            >
                                                                Approve
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="no-image">No pending images</span>
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
                <div
                    className="image-preview-modal"
                    onClick={() => setPreviewImage(null)}
                >
                    <img src={previewImage} alt="Full View" />
                </div>
            )}
        </div>
    );
}

export default Supervisor;
