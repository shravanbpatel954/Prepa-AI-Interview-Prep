import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { signInWithGoogle, auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import backgroundVideo from './assets/hero.mp4'; // Adjust the path as necessary

const AuthPage = ({ isSignUp, onAuthChange, onClose, onAuthSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [resetEmail, setResetEmail] = useState(''); // State for password reset email
    const [showReset, setShowReset] = useState(false); // State to toggle password reset form

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                onAuthSuccess();
                navigate('/Home');
            } else {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                onAuthSuccess();
                navigate('/Home');
            }
        } catch (error) {
            setErrorMessage(error.message); // Show error message
        }
    };

    const handleGoogleAuth = async () => {
        try {
            await signInWithGoogle();
            onAuthSuccess();
            navigate('/Home');
        } catch (error) {
            console.error('Error during Google authentication:', error);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert('Password reset email sent! Check your inbox.');
            setShowReset(false); // Hide the password reset form after sending email
        } catch (error) {
            setErrorMessage(error.message); // Show error message
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-video-background">
                <video autoPlay loop muted className="background-video">
                    <source src={backgroundVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="auth-container">
                <div className="auth-image">
                    <h1><b>Prepare for Interview with Prepa</b></h1>
                </div>
                <div className="auth-form-container">
                    <button className="close-button" onClick={onClose}>✖</button>
                    <h2>{isSignUp ? 'Create an account' : 'Sign In'}</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                    
                    {/* Toggle between Sign In and Sign Up */}
                    {!showReset ? (
                        <form onSubmit={handleSubmit} className="auth-form">
                            {isSignUp && (
                                <div className="name-group">
                                    <div className="input-field">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="First Name"
                                            required
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Last Name"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="input-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                {isSignUp ? 'Create an account' : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        // Password Reset Form
                        <form onSubmit={handlePasswordReset} className="auth-form">
                            <h3>Reset your password</h3>
                            <div className="input-field">
                                <label>Enter your email address:</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Send Password Reset Email
                            </button>
                        </form>
                    )}

                    {/* Forgot Password Link */}
                    {!isSignUp && !showReset && (
                        <p className="forgot-password" onClick={() => setShowReset(true)}>
                            Forgot Password?
                        </p>
                    )}

                    <div className="auth-google">
                        <button className="google-button" onClick={handleGoogleAuth}>
                            {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
                        </button>
                    </div>
                    <p className="switch-auth">
                        {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
                        <button onClick={onAuthChange}>
                            {isSignUp ? 'Sign In' : 'Create an account'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
