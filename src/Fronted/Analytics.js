import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';
import nlp from 'compromise';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Analytics.css';
import { saveUserData } from './firestoreService'; // Firestore save function
import { useParams } from 'react-router-dom'; // Import useParams
import { fetchUserData } from './firestoreService';
import GaugeChart from 'react-gauge-chart';

// Register Chart.js components
Chart.register(...registerables);

const simplifyWithNLP = (transcription) => {
    const doc = nlp(transcription);
    const conciseResponse = doc.out('text');
    return conciseResponse;
};

const analyzeTranscription = (transcription) => {
    const fillerWords = transcription.match(/\b(um|uh|like|you know|basically|actually|literally|seriously|just|sort of|kind of)\b/g) || [];
    const weakWords = ["very", "really", "just", "actually", "probably", "maybe", "kind of", "a bit"];

    const weakWordsDetails = weakWords.reduce((acc, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        let match;
        const occurrences = [];
        while ((match = regex.exec(transcription)) !== null) {
            occurrences.push(match.index);
        }
        if (occurrences.length > 0) {
            acc[word] = { count: occurrences.length, indices: occurrences };
        }
        return acc;
    }, {});

    const repetitions = transcription.split(' ');
    const repetitionsCount = {};
    const timestamps = {}; 

    repetitions.forEach((word, i) => {
        if (repetitionsCount[word]) {
            repetitionsCount[word].count++;
            repetitionsCount[word].indices.push(i);
            timestamps[word] = timestamps[word] || [];
            timestamps[word].push(i);
        } else {
            repetitionsCount[word] = { count: 1, indices: [i] };
            timestamps[word] = [i];
        }
    });

    return {
        fillerWordsCount: fillerWords.length,
        weakWordsDetails,
        repetitionsCount,
        timestamps,
    };
};

const Analytics = () => {
    const location = useLocation();
    const { videoBlob, customQuestions = [], transcriptions = [] } = location.state || {};
    const [videoURL, setVideoURL] = useState(null);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnalysis, setShowAnalysis] = useState(true); 
    const [showAverageResults, setShowAverageResults] = useState(false); 
    const [showRecommendations, setShowRecommendations] = useState(false); 
    const [showGraph, setShowGraph] = useState(false); 
    const [showSummary, setShowSummary] = useState(false);
    const videoRef = React.useRef(null);
    const { id } = useParams(); // Get the ID from the URL
    const [data, setData] = useState(null);
    

    
    const [detailedAnalysis, setDetailedAnalysis] = useState(
        Array(transcriptions.length).fill({ showFiller: false, showWeak: false, showRepetition: false, showSummary: false })
    );
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData(id);
                setData(userData);
            } catch (error) {
                console.error('Error fetching data for analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    
    }, [id]);
    useEffect(() => {
        if (videoBlob) {
            setVideoURL(URL.createObjectURL(videoBlob));
        }
    }, [videoBlob]);

    useEffect(() => {
        const analyzeData = () => {
            setLoading(true);
            const results = transcriptions.map((transcription) => analyzeTranscription(transcription));
            setAnalysisResults(results);
            setLoading(false);
        };

        analyzeData();
    }, [transcriptions, customQuestions]);

    const graphData = {
        labels: analysisResults.map((_, index) => `Response ${index + 1}`),
        datasets: [
            {
                label: 'Filler Words Count',
                data: analysisResults.map(result => result.fillerWordsCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Weak Words Count',
                data: analysisResults.map(result => Object.entries(result.weakWordsDetails).reduce((sum, word) => sum + word[1].count, 0)),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Repetition Count',
                data: analysisResults.map(result => {
                    return Object.entries(result.repetitionsCount).reduce((sum, [_, details]) => {
                        return sum + (details.count > 1 ? details.count : 0);
                    }, 0);
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const calculateAverages = () => {
        const totalFillerWords = analysisResults.reduce((sum, result) => sum + result.fillerWordsCount, 0);
        const totalWeakWords = analysisResults.reduce((sum, result) => {
            return sum + Object.entries(result.weakWordsDetails).reduce((weakSum, [_, details]) => weakSum + details.count, 0);
        }, 0);
        const totalRepetitions = analysisResults.reduce((sum, result) => {
            return sum + Object.entries(result.repetitionsCount).reduce((repSum, [_, details]) => repSum + details.count, 0);
        }, 0);

        const averageFillerWords = (totalFillerWords / analysisResults.length) || 0;
        const averageWeakWords = (totalWeakWords / analysisResults.length) || 0;
        const averageRepetitions = (totalRepetitions / analysisResults.length) || 0;

        return { averageFillerWords, averageWeakWords, averageRepetitions };
    };

    const averages = calculateAverages();
    const performanceRating = 100 - (averages.averageFillerWords * 2 + averages.averageWeakWords * 2 + averages.averageRepetitions * 2);
    const recommendations = [];

    if (averages.averageFillerWords > 2) {
        recommendations.push('Try to reduce your use of filler words. Consider pausing instead of using filler words.');
    } else {
        recommendations.push('Great job on minimizing filler words!');
    }

    if (averages.averageWeakWords > 2) {
        recommendations.push('Avoid using weak words to enhance your speech strength. Focus on being assertive in your responses.');
    } else {
        recommendations.push('Excellent! Your use of strong language is commendable.');
    }

    if (averages.averageRepetitions > 2) {
        recommendations.push('Practice reducing repetitions in your responses. This can enhance the clarity of your communication.');
    } else {
        recommendations.push('Fantastic! Your responses were clear and concise without unnecessary repetitions.');
    }

    const toggleDetail = (index, type) => {
        setDetailedAnalysis(prev => {
            const newState = [...prev];
            newState[index] = {
                ...newState[index],
                [type]: !newState[index][type],
            };
            return newState;
        });
    };

    const summarizeWithCompromise = (text) => {
        let doc = nlp(text);
        let summary = doc.sentences().out('array').slice(0, 2).join(' ');
        return summary;
    };
    
    const generateSummary = () => {
        const summaryPoints = transcriptions.map((transcription, index) => {
            const summary = summarizeWithCompromise(transcription);
            return `Response ${index + 1} Summary: ${summary}`;
        });
        return summaryPoints.join('\n\n').trim();
    };

    const handleSaveData = async () => {
        const summary = generateSummary();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Get time in HH:MM:SS format
    
        const dataToSave = {
            transcriptions,
            analysisResults,
            averages,
            recommendations,
            performanceRating,
            summary,
            videoURL,
            timeSaved: currentTime,  // Only the time is saved here
        };
        try {
            
            await saveUserData(dataToSave); // Firestore save function
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };
    
    return (
        <div className="analytics-page">
        <div className="analytics-container">
            <div className="analytics-left">
                {loading && <p>Loading analysis...</p>}

                {videoURL && (
                    <div className="video-container">
                        <h2>Your Practice Video</h2>
                        <ReactPlayer
                            url={videoURL}
                            controls
                            ref={videoRef}
                        />
                    </div>
                )}
                <div className='savebutton'>
                <button onClick={handleSaveData}>Save Data</button>
                </div> 

                <h2>Transcriptions</h2>
                {transcriptions.length > 0 && customQuestions.length > 0 ? (
                    <ul>
                        {customQuestions.map((question, index) => (
                            <li key={index}>
                                <p><strong>Question:</strong> {question}</p>
                                <p><strong>Transcription:</strong> {transcriptions[index]}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transcriptions or questions available.</p>
                )}
            </div>

            <div className="analytics-right">
            <div className="collapsible-section speech-analysis-section">
    <button className="collapsible speech-analysis-toggle" onClick={() => setShowAnalysis(!showAnalysis)}>
        {showAnalysis ? 'Hide Speech Analysis' : 'Show Speech Analysis'}
    </button>
    {showAnalysis && (
        <div className="content speech-analysis-content">
            <h2>Speech Analysis</h2>
            {analysisResults.map((result, index) => (
                <div key={index} className="response-analysis response-analysis-section">
                    {/* Toggle for Response Analysis */}
                    <div className="collapsible-section response-toggle-section">
                        <button
                            className="collapsible response-toggle"
                            onClick={() => toggleDetail(index, 'showResponseDetails')}
                        >
                            {detailedAnalysis[index].showResponseDetails ? 'Hide Response' : `Response ${index + 1}`}
                        </button>

                        {/* Show detailed response analysis */}
                        {detailedAnalysis[index].showResponseDetails && (
                            <div className="response-details">
                                <div className="collapsible-section filter-word-analysis-section">
                                    <button
                                        className="collapsible filter-word-toggle"
                                        onClick={() => toggleDetail(index, 'showFilter')}
                                    >
                                        {detailedAnalysis[index].showFilter ? 'Hide Filter Word Analysis' : 'Show Filter Word Analysis'}
                                    </button>
                                    {detailedAnalysis[index].showFilter && (
                                        <div className="details filter-words-details">
                                            <p>
                                                <strong>Filter Words:</strong> {result.filterWordsCount > 0 ? result.filterWords.join(', ') : 'None'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="collapsible-section weak-words-analysis-section">
                                    <button
                                        className="collapsible weak-word-toggle"
                                        onClick={() => toggleDetail(index, 'showWeak')}
                                    >
                                        {detailedAnalysis[index].showWeak ? 'Hide Weak Words Analysis' : 'Show Weak Words Analysis'}
                                    </button>
                                    {detailedAnalysis[index].showWeak && (
                                        <div className="details weak-words-details">
                                            <h4>Weak Words Count:</h4>
                                            <ul>
                                                {Object.entries(result.weakWordsDetails).map(([word, details]) => (
                                                    <li key={word}>
                                                        {word}: {details.count} (Indices: {details.indices.join(', ')})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="collapsible-section repetition-analysis-section">
                                    <button
                                        className="collapsible repetition-toggle"
                                        onClick={() => toggleDetail(index, 'showRepetition')}
                                    >
                                        {detailedAnalysis[index].showRepetition ? 'Hide Repetition Analysis' : 'Show Repetition Analysis'}
                                    </button>
                                    {detailedAnalysis[index].showRepetition && (
                                        <div className="details repetition-details">
                                            <h4>Repetition Count:</h4>
                                            <ul>
                                                {Object.entries(result.repetitionsCount).map(([word, details]) => (
                                                    <li key={word}>
                                                        {word}: {details.count} (Indices: {details.indices.join(', ')})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} </div> </div> ))} </div> )}</div>

                    <div className="collapsible-section">
                    <button className="collapsible" onClick={() => setShowAverageResults(!showAverageResults)}>
                    {showAverageResults ? 'Hide Average Results' : 'Show Average Results'}
                     </button>
                     {showAverageResults && (
                     <div className="content">
                      <h2>Average Results</h2>
                       <p>Average Filler Words: {averages.averageFillerWords.toFixed(2)}</p>
                       <p>Average Weak Words: {averages.averageWeakWords.toFixed(2)}</p>
                       <p>Average Repetitions: {averages.averageRepetitions.toFixed(2)}</p>
                       <p>Performance Rating: {performanceRating.toFixed(2)}%</p>
                     <div className="gauge-container">
                     <GaugeChart 
                     id="gauge-chart"
                     nrOfLevels={20}
                     percent={performanceRating / 100} // Convert to a 0-1 range for the gauge chart
                     arcPadding={0.02}
                     textColor="#000000"
                     style={{ width: 'auto', height: 'auto' }} 
                   />
                  </div>
                 </div>
                   )}</div>

                <div className="collapsible-section">
                    <button className="collapsible" onClick={() => setShowRecommendations(!showRecommendations)}>
                        {showRecommendations ? 'Hide Recommendations' : 'Show Recommendations'}
                    </button>
                    {showRecommendations && (
                        <div className="content">
                            <h2>Recommendations</h2>
                            <ul>
                                {recommendations.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="collapsible-section">
                    <button className="collapsible" onClick={() => setShowGraph(!showGraph)}>
                        {showGraph ? 'Hide Analysis Graph' : 'Show Analysis Graph'}
                    </button>
                    {showGraph && (
                        <div className="content">
                            <h2>Analysis Graph</h2>
                            <Bar data={graphData} />
                        </div>
                    )}
                </div>

                <div className="collapsible-section">
                    <button className="collapsible" onClick={() => setShowSummary(!showSummary)}>
                        {showSummary ? 'Hide Overall Summary' : 'Show Overall Summary'}
                    </button>
                    {showSummary && (
                        <div className="content">
                            <h2>Overall Summary</h2>
                            <p>{generateSummary()}</p>
                        </div>     
                    )}
                </div>  
            </div>
        </div>
        </div>
    );
};

export default Analytics;
