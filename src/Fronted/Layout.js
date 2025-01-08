// src/Fronted/Layout.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';
import logoImage from './assets/logo.png';
import profileIcon from './assets/practice.jpeg'; // Default icon
import { auth, signOutUser } from './firebase'; // Import signOutUser and auth

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar is collapsed by default
    const practiceMenuRef = useRef(null);
    const [user, setUser] = useState(null); // Store the user information

    const navigate = useNavigate(); // Use navigate to redirect after logout

    // Fetch authenticated user info
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                // User is signed in
                setUser(currentUser);
            } else {
                // User is signed out
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleClickOutside = (event) => {
        if (practiceMenuRef.current && !practiceMenuRef.current.contains(event.target)) {
            // Close practice menu logic if implemented in the future
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        signOutUser() // Call signOutUser from firebase.js
            .then(() => {
                // Successfully signed out
                navigate('/'); // Redirect to the BodySection.js page
            })
            .catch((error) => {
                console.error('Sign out error:', error);
            });
    };

    return (
        <div className={`layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <aside className="sidebar">
                <div className="logo-container">
                    <div className="logo-flex">
                        <img 
                            src={logoImage} 
                            alt="Prepa Logo" 
                            className={`logo-image ${isSidebarCollapsed ? 'collapsed-logo' : ''}`} 
                        />
                        {!isSidebarCollapsed && <div className="logo">repa</div>}
                    </div>
                    <button onClick={toggleSidebar} className="sidebar-toggle">
                        {isSidebarCollapsed ? '>' : '<'}
                    </button>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/practice/interview" className="practice-toggle">
                                <span className="nav-icon">🎯</span>
                                {!isSidebarCollapsed && 'Let\'s Practice'}       
                            </Link>
                        </li>
                        <li>
                            <Link to="/home">
                                <span className="nav-icon">🏠</span>
                                {!isSidebarCollapsed && 'Home'}
                            </Link>
                        </li>
                        <li>
                            <Link to="/myprepa">
                                <span className="nav-icon">📚</span>
                                {!isSidebarCollapsed && 'My Prepa'}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="profile-section">
                    {/* Display the user's profile image and email */}
                    {user ? (
                        <>
                            <img 
                                src={user.photoURL || profileIcon} // Use user's profile photo or default
                                alt="Profile" 
                                className="profile-icon" 
                            />
                            {!isSidebarCollapsed && (
                                <div className="profile-info">
                                    <p>{user.displayName || user.email}</p> {/* Display the user's name or email */}
                                    <p>{user.email}</p> {/* Display the user's email */}
                                    <button onClick={handleSignOut} className="signout-btn">🚪 Logout</button> {/* Logout button */}
                                </div>
                            )}
                        </>
                    ) : (
                        <img src={profileIcon} alt="Profile" className="profile-icon" /> // Default if no user is logged in
                    )}
                </div>
            </aside>
            <main>
                {React.Children.map(children, child => {
                    // Pass user prop to children
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { user });
                    }
                    return child;
                })}
            </main>
        </div>
    );
};

export default Layout;
