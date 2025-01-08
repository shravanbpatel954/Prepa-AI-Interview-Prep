import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Fronted/Layout';
import './App.css';
import Navbar from './Fronted/Navbar';
import BodySection from './Fronted/BodySection';
import AuthPage from './Fronted/AuthPage';
import Home from './Fronted/Home';
import Interview from './Fronted/Interview';
import MyPrepa from './Fronted/myprepa';
import Analytics from './Fronted/Analytics';
import { auth } from './Fronted/firebase'; // Import your auth module
import StoredAnalytics from './Fronted/StoredAnalytics';


const App = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [showAuthPage, setShowAuthPage] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const toggleAuthType = () => {
        setIsSignUp(!isSignUp);
    };

    const openAuthModal = (type) => {
        setIsSignUp(type === 'signup');
        setShowAuthPage(true);
    };

    const closeAuthModal = () => {
        setShowAuthPage(false);
    };

    const handleAuthSuccess = () => {
        setShowAuthPage(false);
    };

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            {!showAuthPage && (
                                <>
                                    <Navbar openAuthModal={openAuthModal} />
                                    <BodySection openAuthModal={openAuthModal} />
                                </>
                            )}
                            {showAuthPage && (
                                <AuthPage
                                    isSignUp={isSignUp}
                                    onAuthChange={toggleAuthType}
                                    onClose={closeAuthModal}
                                    onAuthSuccess={handleAuthSuccess}
                                />
                            )}
                        </>
                    }
                />
                <Route 
                    path="/home" // Add route for Home page
                    element={user ? <Layout><Home /></Layout> : <Navigate to="/" replace />} 
                />

                <Route 
                    path="/practice/interview" 
                    element={user ? <Layout><Interview /></Layout> : <Navigate to="/" replace />} 
                />
                
                <Route 
                    path="/myprepa" 
                    element={user ? <Layout><MyPrepa /></Layout> : <Navigate to="/" replace />} 
                />
                <Route 
                    path="/analytics" 
                    element={user ? <Layout><Analytics /></Layout> : <Navigate to="/" replace />} 
                />
                <Route 
                 path="/analytics/:id" 
                 element={user ? <Layout><StoredAnalytics /></Layout> : <Navigate to="/" replace />} 
/>
            </Routes>
        </>
    );
};

// AppWrapper adds Router context to the application
const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
