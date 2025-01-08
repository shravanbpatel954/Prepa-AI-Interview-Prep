import React, { useState } from 'react';
import './Navbar.css';
import logo from './assets/logo.png'; // Update this path as necessary

const Navbar = ({ openAuthModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('no-scroll', !isOpen);
  };

  // Smooth scroll to the section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionOffset = section.offsetTop;
      window.scrollTo({
        top: sectionOffset,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={() => scrollToSection('home')}>
            <img src={logo} alt="Prepa Logo" className="logo-image" />
            <span className="nav-logo-text">repa</span> 
          </a>
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <a href="#home" onClick={() => scrollToSection('home')} className="nav-link"><b>Home</b></a>
            </li>
            <li className="nav-item">
              <a href="#about" onClick={() => scrollToSection('about')} className="nav-link"><b>About</b></a>
            </li>
            <li className="nav-item">
              <a href="#blog" onClick={() => scrollToSection('blog')} className="nav-link"><b>Blog</b></a>
            </li>
            <li className="nav-item">
              <a href="#contact" onClick={() => scrollToSection('contact')} className="nav-link"><b>Contact</b></a>
            </li>
            <li className="nav-item signup-button">
              <button onClick={() => openAuthModal('signup')} className="nav-signup">Signup</button>
            </li>
            <li className="nav-item signin-button">
              <button onClick={() => openAuthModal('signin')} className="nav-signin">Sign In</button>
            </li>
          </ul>
          <div className="nav-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
