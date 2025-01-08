import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CameraView.css';
import interviewer from './assets/interviewer.png'; // Ensure this is used appropriately
import checkIcon from './assets/endicon.jpeg';

const CameraView = ({
    onClose,
    onPause = () => console.log('Paused'),
    onResume = () => console.log('Resumed'),
    customQuestions = [],
}) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecordingPaused, setIsRecordingPaused] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [isCountdownActive, setIsCountdownActive] = useState(true);
    const [isPracticeEnded, setIsPracticeEnded] = useState(false);
    const [questionTime, setQuestionTime] = useState(0);
    const [countdownFinished, setCountdownFinished] = useState(false);
    const [error, setError] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    const [transcriptions, setTranscriptions] = useState([]);
    const navigate = useNavigate();

    const questions = customQuestions;
    const minimumQuestionTime = 10;
    const minimumTotalTime = 45;

    // Speech Recognition Setup
    const recognition = useRef(null);

    useEffect(() => {
        recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.current.lang = 'en-IN';
        recognition.current.interimResults = true;
        recognition.current.continuous = true;

        recognition.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setTranscriptions(prevTranscriptions => {
                const newTranscriptions = [...prevTranscriptions];
                newTranscriptions[currentQuestionIndex] = transcript;
                return newTranscriptions;
            });
        };

        recognition.current.onerror = (event) => {
            console.error('Speech recognition error: ', event.error);
            setError(`Error with speech recognition: ${event.error}`);
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                startRecognition();
            }
        };

        return () => {
            recognition.current.abort(); // Stop recognition on cleanup
        };
    }, [currentQuestionIndex]);

    const startRecognition = () => {
        if (recognition.current && recognition.current.state !== 'active') {
            recognition.current.start();
        }
    };

    useEffect(() => {
        const enableCamera = async () => {
            if (!stream) {
                try {
                    const userStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                    videoRef.current.srcObject = userStream;
                    setStream(userStream);

                    const recorder = new MediaRecorder(userStream);
                    setMediaRecorder(recorder);

                    recorder.ondataavailable = (event) => {
                        setVideoBlob(event.data);
                    };
                } catch (error) {
                    setError('Error accessing the camera or microphone. Please check your device settings.');
                    console.error('Error accessing the camera or microphone: ', error);
                }
            }
        };

        enableCamera();

        return () => {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.start();
            startRecognition(); // Start speech recognition
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
                setQuestionTime((prevQuestionTime) => prevQuestionTime + 1);
            }, 1000);
        }
    }, [mediaRecorder]);

    useEffect(() => {
        if (isCountdownActive) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown > 1) {
                        return prevCountdown - 1;
                    } else {
                        setIsCountdownActive(false);
                        setCountdownFinished(true);
                        clearInterval(countdownInterval);
                        startRecording();
                        speakQuestion(questions[currentQuestionIndex]);
                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [isCountdownActive, startRecording, questions, currentQuestionIndex]);

    const pauseRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            recognition.current.stop(); // Stop recognition when paused
            setIsRecordingPaused(true); // Set the state to paused
            onPause();
        }
    };

    const resumeRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            startRecognition(); // Restart recognition
            setIsRecordingPaused(false); // Set the state to not paused
            onResume();
        }
    };

    useEffect(() => {
        if (isRecordingPaused) {
            clearInterval(timerRef.current);
        } else if (!isCountdownActive && countdownFinished) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
                setQuestionTime((prevQuestionTime) => prevQuestionTime + 1);
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [isRecordingPaused, isCountdownActive, countdownFinished]);

    const handleNextQuestion = () => {
        if (questionTime >= minimumQuestionTime) {
            if (currentQuestionIndex < questions.length - 1) {
                recognition.current.stop(); // Stop recognition for the current question
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setQuestionTime(0);
                setTimeout(() => {
                    startRecognition(); // Start recognition for the new question
                    speakQuestion(questions[currentQuestionIndex + 1]);
                }, 500); // Optional delay
            } else if (time >= minimumTotalTime) {
                setIsPracticeEnded(true);
                clearInterval(timerRef.current);
                if (mediaRecorder) mediaRecorder.stop();
            }
        } else {
            alert(`Please spend at least ${minimumQuestionTime} seconds on this question.`);
        }
    };

    const handleDone = () => {
        setIsPracticeEnded(true);
        clearInterval(timerRef.current);
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        recognition.current.stop(); // Stop recognition on done
    };

    const handleViewAnalytics = () => {
        navigate('/analytics', { state: { videoBlob, customQuestions: questions, transcriptions } });
    };

    const handleCancelInterview = () => {
        if (onClose) {
            onClose(); // Call the close handler passed as prop
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const speakQuestion = (question) => {
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'en-IN';
        const voices = window.speechSynthesis.getVoices();
        const femaleIndianVoice = voices.find(voice =>
            voice.lang === 'en-IN' && (
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('woman')
            )
        );
        const indianVoice = voices.find(voice => voice.lang === 'en-IN');
        utterance.voice = femaleIndianVoice || indianVoice || voices[0];
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="camera-overlay">
            <div className="camera-view">
                <button className="close-button" onClick={handleCancelInterview}>X</button>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="hint-box">
                    <p>Speak at least for 45 seconds for better results</p>
                </div>
                {isPracticeEnded ? (
                    <div className="practice-ended-message">
                        <img src={checkIcon} alt="Done" />
                        <h2>Your Practice is Done!</h2>
                        <button onClick={handleViewAnalytics}>View Analytics</button>
                    </div>
                ) : (
                    <>
                        {/* Interviewer Image */}
                        <div className="interviewer-image">
                            <img src={interviewer} alt="Interviewer" />
                        </div>
                        <div className="video-container">
                            <video ref={videoRef} autoPlay muted />
                        </div>
                        {isCountdownActive ? (
                            <div className="countdown">{countdown}</div>
                        ) : (
                            <div className="controls">
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button onClick={handleNextQuestion}>Next Question</button>
                                ) : (
                                    <button onClick={handleDone}>Done</button>
                                )}
                                {isRecordingPaused ? (
                                    <button onClick={resumeRecording}>Resume</button>
                                ) : (
                                    <button onClick={pauseRecording}>Pause</button>
                                )}
                            </div>
                        )}
                        <div className="time-display">
                            Time: {formatTime(time)} | Question Time: {formatTime(questionTime)}
                        </div>

                        {/* Add the current custom question below the time section */}
                        <div className="current-question-display">
                            <p>{questions[currentQuestionIndex]}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraView;
