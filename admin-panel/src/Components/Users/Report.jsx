import React, { useState, useEffect } from "react";
import "../CSS/Report.css"; // Optional: create for external styling

const Report = () => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageURLs, setImageURLs] = useState({});

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch("http://localhost:5005/floorData?page=0&size=100");
            const data = await res.json();
            const allData = data._embedded?.floorDatas || [];
            setImages(allData);
        } catch (error) {
            console.error("Error fetching floor data:", error);
        }
    };

    const handleFilter = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("User not authenticated. Please login.");
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            const result = images.filter(item => {
                if (!item.taskImage) return false;

                const match = item.taskImage.match(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/);
                if (!match) return false;

                const [y, m, d, hr, min] = match[0].split("-").map(Number);
                const date = new Date(y, m - 1, d, hr, min);
                return date >= start && date <= end;
            });

            setFilteredImages(result);

            const urls = {};
            result.forEach(item => {
                let id = item.id;
                if (!id && item._links?.self?.href) {
                    const hrefParts = item._links.self.href.split('/');
                    id = hrefParts[hrefParts.length - 1];
                }
                if (id) {
                    urls[id] = `http://localhost:5005/floorData/${id}/image`;
                    item.id = id;
                }
            });

            setImageURLs(urls);
        } catch (error) {
            console.error("Error filtering images:", error);
            alert("Failed to load images.");
        }
    };

    const extractDateFromFilename = (filename) => {
        const match = filename.match(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/);
        if (!match) return null;

        const [y, m, d, hr, min] = match[0].split('-').map(Number);
        const date = new Date(y, m - 1, d, hr, min);
        return date.toLocaleString(); // returns "8/8/2025, 5:52 AM"
    };


    return (
        <div className="report-container">
            <h2 className="report-title">Image Report (All Floors)</h2>
            <div className="filter-bar">
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
                <button className="fetch-button" onClick={handleFilter}>Fetch Images</button>
            </div>

            {filteredImages.length === 0 ? (
                <p className="no-images">No images found for selected date range.</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(
                            filteredImages.reduce((acc, img) => {
                                const dateOnly = extractDateFromFilename(img.taskImage)?.split(",")[0]; // "8/8/2025"
                                if (!dateOnly) return acc;
                                if (!acc[dateOnly]) acc[dateOnly] = [];
                                acc[dateOnly].push(img);
                                return acc;
                            }, {})
                        ).map(([date, images]) => (
                            <tr key={date}>
                                <td className="date-column">{date}</td>
                                <td className="images-column">
                                    <div className="image-row">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="image-card">
                                                <p className="floor-label">
                                                    <strong>{img.floorName}</strong> – {img.subFloorName}
                                                </p>
                                                <p>Type: {img.imageType}</p>
                                                <p><strong>Time:</strong> {extractDateFromFilename(img.taskImage)?.split(",")[1]}</p>
                                                {imageURLs[img.id] ? (
                                                    <img src={imageURLs[img.id]} alt={img.taskImage} />
                                                ) : (
                                                    <p>Loading image...</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};

export default Report;