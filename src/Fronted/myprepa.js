import React, { useEffect, useState } from 'react';
import './myprepa.css'; 
import { fetchUserData, deleteUserData } from './firestoreService';
import { useNavigate } from 'react-router-dom';

const MyPrepa = () => {
    const [prepaData, setPrepaData] = useState([]);
    const navigate = useNavigate(); 

    // Fetch the saved data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserData();
                if (data) {
                    // Convert object to array for mapping and include index for display
                    const dataArray = Object.entries(data).map(([id, item]) => ({
                        id,
                        ...item
                    }));
                    setPrepaData(dataArray); 
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    // Handle opening analytics for a specific entry
    const handleOpenAnalytics = (id) => {
        navigate(`/analytics/${id}`); // Navigate to the analytics page with the ID
    };

    // Handle deleting an entry
    const handleDelete = async (id) => {
        try {
            await deleteUserData(id); // Call delete function
            setPrepaData((prevData) => prevData.filter(item => item.id !== id)); // Remove the deleted entry from state
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    
    return (
        <div className="myprepa-container">
            <h1><span style={{color: '#007bff'}}>MyPrepa's Library</span></h1>
            <div className="myprepa-content">
                <div className="myprepa-header">
                    <div className="myprepa-header-title">Title</div>
                    <div className="myprepa-header-created">Created</div>
                    <div className="myprepa-header-time">Time</div>
                    <div className="myprepa-header-performance">Performance (%)</div>
                    <div className="myprepa-header-action">Action</div>
                </div>
                {prepaData.length > 0 ? (
                    prepaData.map(({ id, created, timeSaved, performanceRating }, index) => (
                        <div className="myprepa-item" key={id} onClick={() => handleOpenAnalytics(id)} style={{ cursor: 'pointer' }}>
                            <div className="myprepa-item-title">{`Interview Practice ${index + 1}`}</div>
                            <div className="myprepa-item-created">{created ? new Date(created).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                            <div className="myprepa-item-time">{timeSaved || 'N/A'}</div>
                            <div className="myprepa-item-performance">{performanceRating !== undefined ? performanceRating : 'N/A'}</div>
                            <div className="myprepa-item-action">
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(id); }}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Data is Loading......</p>
                )}
            </div>
        </div>
    );
};

export default MyPrepa;
