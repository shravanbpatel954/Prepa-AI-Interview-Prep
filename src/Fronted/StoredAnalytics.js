import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import GaugeChart from 'react-gauge-chart'; // For the gauge chart
import './StoredAnalytics.css';
import { fetchUserDataById } from './firestoreService'; // Fetching data service

Chart.register(...registerables); // Register Chart.js components

const Analytics = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [practiceData, setPracticeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false); // Toggle for Analysis section
    const [showAverages, setShowAverages] = useState(false); // Toggle for Averages section
    const [showGraph, setShowGraph] = useState(false); // Toggle for Graph section
    const [showRecommendations, setShowRecommendations] = useState(false); // Toggle for Recommendations
    const [showSummary, setShowSummary] = useState(false); // Toggle for Summary
    const [showTranscription, setShowTranscription] = useState(false); // Toggle for Transcription

    useEffect(() => {
        const fetchPracticeData = async () => {
            try {
                const data = await fetchUserDataById(id);
                setPracticeData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPracticeData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const toggleSection = (section) => {
        if (section === 'analysis') {
            setShowAnalysis(!showAnalysis);
        } else if (section === 'averages') {
            setShowAverages(!showAverages);
        } else if (section === 'graph') {
            setShowGraph(!showGraph);
        } else if (section === 'recommendations') {
            setShowRecommendations(!showRecommendations);
        } else if (section === 'summary') {
            setShowSummary(!showSummary);
        } else if (section === 'transcription') {
            setShowTranscription(!showTranscription);
        }
    };

    // Prepare the average result graph data
    const graphData = {
        labels: ['Filler Words', 'Weak Words', 'Repetitions'],
        datasets: [
            {
                label: 'Average Count',
                data: [
                    practiceData.averages.averageFillerWords,
                    practiceData.averages.averageWeakWords,
                    practiceData.averages.averageRepetitions,
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="analytics-page">
            <div className="analytics-container">
            <div className="analytics-left">

                <h1>Practice Analytics</h1>

                {/* Video section */}
                <div className="section">
                    <h3>Video:</h3>
                    <video 
                        width="640" 
                        height="360" 
                        controls 
                        src={practiceData.videoURL} 
                        alt="Interview Practice Video"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div></div>

                <div className='Transcription'>
                <h3>Transcriptions:</h3>
            <ul>
                {practiceData.transcriptions.map((transcription, index) => (
                    <li key={index}>
                        <strong>Response {index + 1}:</strong> {transcription}
                    </li>
                ))}
            </ul></div></div>
             
                
             <div className="analytics-right">
                {/* Collapsible analysis section */}
                <div className="section">
                    <h3 onClick={() => toggleSection('analysis')}>
                        {showAnalysis ? 'Hide' : 'Show'} Analysis Results
                    </h3>
                    {showAnalysis && (
                        <div>
                            {practiceData.analysisResults.map((result, index) => (
                                <div key={index}>
                                    <h4>Response {index + 1} Analysis:</h4>
                                    <p>Filler Words Count: {result.fillerWordsCount}</p>
                                    <p>Weak Words Details:</p>
                                    <ul>
                                        {Object.entries(result.weakWordsDetails).map(([word, details]) => (
                                            <li key={word}>
                                                {word}: {details.count} (Indices: {details.indices.join(', ')})
                                            </li>
                                        ))}
                                    </ul>
                                    <p>Repetition Count:</p>
                                    <ul>
                                        {Object.entries(result.repetitionsCount).map(([word, details]) => (
                                            <li key={word}>
                                                {word}: {details.count} (Indices: {details.indices.join(', ')})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Collapsible averages section */}
                <div className="section">
                    <h3 onClick={() => toggleSection('averages')}>
                        {showAverages ? 'Hide' : 'Show'} Average Results
                    </h3>
                    {showAverages && (
                        <div>
                            <p>Average Filler Words: {practiceData.averages.averageFillerWords.toFixed(2)}</p>
                            <p>Average Weak Words: {practiceData.averages.averageWeakWords.toFixed(2)}</p>
                            <p>Average Repetitions: {practiceData.averages.averageRepetitions.toFixed(2)}</p>

                            {/* Gauge chart for performance */}
                            <h4>Overall Performance Rating:</h4>
                            <GaugeChart 
                                id="performance-gauge"
                                nrOfLevels={20}
                                percent={practiceData.performanceRating / 100}
                                textColor="#000"
                                formatTextValue={(value) => `${value}%`}
                            />
                        </div>
                    )}
                </div>

                {/* Collapsible graph section */}
                <div className="section">
                    <h3 onClick={() => toggleSection('graph')}>
                        {showGraph ? 'Hide' : 'Show'} Graph of Average Results
                    </h3>
                    {showGraph && (
                        <Bar 
                            data={graphData}
                            options={{
                                scales: {
                                    y: { 
                                        beginAtZero: true,
                                        max: 10,
                                    },
                                },
                            }}
                        />
                    )}
                </div>

                {/* Collapsible Recommendations section */}
                <div className="section">
                    <h3 onClick={() => toggleSection('recommendations')}>
                        {showRecommendations ? 'Hide' : 'Show'} Recommendations
                    </h3>
                    {showRecommendations && (
                        <ul>
                            {practiceData.recommendations.map((recommendation, index) => (
                                <li key={index}>{recommendation}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Collapsible Summary section */}
                <div className="section">
                    <h3 onClick={() => toggleSection('summary')}>
                        {showSummary ? 'Hide' : 'Show'} Summary
                    </h3>
                    {showSummary && (
                        <>
                            <p>{practiceData.summary}</p>
                            <h4>Time Saved:</h4>
                            <p>{practiceData.timeSaved}</p>
                        </>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
