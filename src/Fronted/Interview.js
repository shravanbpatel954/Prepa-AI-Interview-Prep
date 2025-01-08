import React, { useState, useEffect, useRef } from 'react';
import './Interview.css';
import QuestionBank from './QuestionBank';
import { FaPencilAlt, FaMicrophoneAlt, FaMicrophoneAltSlash } from 'react-icons/fa';
import CameraView from './CameraView'; // Import the CameraView component
import interviewer from './assets/interviewer.png';
import { useNavigate } from 'react-router-dom';

const rolesList = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Marketing Specialist',
    'Sales Manager',
    'Generalist',
];

const Interview = () => {
    const [role, setRole] = useState('');
    const [interviewerType, setInterviewerType] = useState('Professional');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showQuestionBank, setShowQuestionBank] = useState(false);
    const [customQuestions, setCustomQuestions] = useState([]);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
    const [showCameraView, setShowCameraView] = useState(false); // Add state for CameraView visibility
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRecording, isPaused]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleCustomQuestionClick = () => {
        setShowQuestionBank(true);
    };

    const handleEditClick = () => {
        setShowQuestionBank(true);
    };

    const closeQuestionBank = () => {
        setShowQuestionBank(false);
    };

    const saveCustomQuestions = (questions) => {
        setCustomQuestions(questions);
        closeQuestionBank();
    };

    const removeQuestion = (indexToRemove) => {
        setCustomQuestions((prevQuestions) =>
            prevQuestions.filter((_, index) => index !== indexToRemove)
        );
    };

    const startRecording = () => {
        if (role === '') {
            alert("Please select a role.");
            return;
        }
        if (customQuestions.length === 0) {
            alert("Select at least 1 question to start practicing the interview.");
            return;
        }
        setIsRecording(true);
        setIsPaused(false);
        setShowCameraView(true); // Show the CameraView component
    };

    const stopRecording = () => {
        setIsRecording(false);
        setRecordingTime(0);
        setShowCameraView(false); // Hide the CameraView component
        // Navigate to the Analytics page with state
        navigate('/analytics', { state: { role, interviewerType, customQuestions } });
    };

    const pauseRecording = () => {
        setIsPaused(true);
    };

    const resumeRecording = () => {
        setIsPaused(false);
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            if (videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
            setIsCameraOn(false);
        } else {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: isMicrophoneOn,
                });
                videoRef.current.srcObject = videoStream;
                setIsCameraOn(true);
            } catch (error) {
                console.error('Error accessing the camera: ', error);
            }
        }
    };

    const toggleMicrophone = () => {
        setIsMicrophoneOn((prevState) => !prevState);
        if (videoRef.current.srcObject) {
            const audioTracks = videoRef.current.srcObject.getAudioTracks();
            audioTracks.forEach((track) => (track.enabled = !track.enabled));
        }
    };

    const closeCameraView = () => {
        setShowCameraView(false);
        stopRecording(); // Stop recording when closing the CameraView
    };

    return (
        <>
            {showCameraView && (
                <div className="camera-overlay">
                    {/* Pass customQuestions as a prop */}
                    <CameraView 
                        onClose={closeCameraView} 
                        customQuestions={customQuestions} 
                    />
                </div>
            )}

            {!showCameraView && (
                <div className="interview-container">
                    <div className="interview-content">
                        <div className="personalize-section">
                            <h2>Personalize your interview</h2>

                            <div className="input-group role-input-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={handleRoleChange}
                                    placeholder="Type a role or select from the list"
                                    className="combo-input"
                                    list="roles"
                                />
                                <datalist id="roles">
                                    {rolesList.map((roleOption) => (
                                        <option key={roleOption} value={roleOption}>
                                            {roleOption}
                                        </option>
                                    ))}
                                </datalist>
                            </div>

                            <div className="input-group">
                                <label>Interviewer</label>
                                <select
                                    value={interviewerType}
                                    onChange={(e) => setInterviewerType(e.target.value)}
                                    className="combo-input"
                                >
                                    <option value="Professional">Professional</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Friendly">Friendly</option>
                                </select>
                            </div>

                            <h3 className="question-label">
                                Interview practice questions
                                <span className="edit-icon-space"></span>
                                <button className="edit-button" onClick={handleEditClick}>
                                    <FaPencilAlt />
                                </button>
                            </h3>

                            {customQuestions.length < 5 && (
                                <div
                                    className="custom-question-box"
                                    onClick={handleCustomQuestionClick}
                                >
                                    <p className="custom-question-placeholder">
                                        Click to add a custom question
                                    </p>
                                </div>
                            )}

                            <ul className="custom-question-list">
                                {customQuestions.map((question, index) => (
                                    <li key={index} className="custom-question-item">
                                        <span>{question}</span>
                                        <button
                                            className="remove-question-button"
                                            onClick={() => removeQuestion(index)}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="video-section">
                            <div className="video-placeholder">
                                <video className="video" ref={videoRef} autoPlay muted />
                                <div className="microphone-box">
                                    <img src={interviewer} alt="Interviewer" />
                                    <button
                                        className="microphone-button"
                                        onClick={toggleMicrophone}
                                    >
                                        {isMicrophoneOn ? <FaMicrophoneAlt /> : <FaMicrophoneAltSlash />}
                                    </button>
                                </div>
                            </div>

                            <div className="video-controls">
                                <button
                                    onClick={toggleCamera}
                                    className={`control-button toggle-camera ${isCameraOn ? 'camera-on' : 'camera-off'}`}
                                >
                                    {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                                </button>

                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="control-button start-recording"
                                    >
                                        Start
                                    </button>
                                ) : isPaused ? (
                                    <button
                                        onClick={resumeRecording}
                                        className="control-button resume-recording"
                                    >
                                        Resume
                                    </button>
                                ) : (
                                    <button
                                        onClick={pauseRecording}
                                        className="control-button pause-recording"
                                    >
                                        Pause
                                    </button>
                                )}
                                {isRecording && (
                                    <button
                                        onClick={stopRecording}
                                        className="control-button stop-recording"
                                    >
                                        Stop Recording
                                    </button>
                                )}
                            </div>

                            <div className="recording-timer">
                                {isRecording && !isPaused && (
                                    <p>Recording Time: {recordingTime} seconds</p>
                                )}
                                {isPaused && <p>Recording Paused</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showQuestionBank && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <QuestionBank
                            onClose={closeQuestionBank}
                            onSaveQuestions={saveCustomQuestions}
                            initialSelectedQuestions={customQuestions}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Interview;