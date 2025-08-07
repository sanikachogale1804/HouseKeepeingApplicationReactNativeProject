import React, { useState, useEffect } from "react";

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

            // Filter kar rahe ho taskImage ke date se
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
                } else {
                    console.warn("Missing ID for item:", item);
                }
            });


            setImageURLs(urls);
        } catch (error) {
            console.error("Error fetching report images:", error);
            alert("Failed to load images.");
        }
    };


    return (
        <div style={{ padding: "20px" }}>
            <h2> Image Report (All Floors) </h2>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Start Date:{" "}
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                &nbsp;&nbsp;
                <label>
                    End Date:{" "}
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
                &nbsp;&nbsp;
                <button onClick={handleFilter}>Fetch Images</button>
            </div>
            {filteredImages.length === 0 ? (
                <p>No images found for selected date range.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {filteredImages.map((img, idx) => (
                        <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
                            <p><strong>{img.floorName}</strong> – {img.subFloorName}</p>
                            <p>Type: {img.imageType}</p>
                            {imageURLs[img.id] ? (
                                <img src={imageURLs[img.id]} alt={img.taskImage} style={{ width: "100%", height: "auto" }} />
                            ) : (
                                <p>Loading image...</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Report;
