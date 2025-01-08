// src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Custom styling
import Video from './assets/prepaai.mp4';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const userName = user ? user.displayName || user.email : "User";

  const handlePracticeNow = () => {
    navigate('/practice/interview'); // Redirect to Interview.js
  };

  const handleMyPrepa = () => {
    navigate('/myprepa'); // Redirect to MyPrepa.js
  };

  // Resource data
  const resources = [
    {
      id: 'article1',
      title: "Interview Preparation Guide",
      content: (
        <div>
          <p>This guide will help you understand the various stages of interview preparation, including:</p>
          <ul>
            <li><strong>Research the Company:</strong> Learn about the company’s values, culture, products, and recent news.</li>
            <li><strong>Understand the Job Description:</strong> Identify key skills and experiences required for the position.</li>
            <li><strong>Prepare Your Questions:</strong> Have insightful questions ready to ask the interviewer about the role and the company.</li>
            <li><strong>Practice Behavioral Questions:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your answers.</li>
            <li><strong>Dress Appropriately:</strong> Dress according to the company's culture—business professional or business casual.</li>
            <li><strong>Follow-Up:</strong> Always send a thank-you email after the interview to express appreciation for the opportunity.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'article2',
      title: "Common Interview Questions",
      content: (
        <div>
          <p>Here are some frequently asked interview questions along with tips on how to answer them effectively:</p>
          <ul>
            <li><strong>Tell me about yourself.</strong> - Focus on your professional background and relevant experiences.</li>
            <li><strong>What are your strengths and weaknesses?</strong> - Be honest, and relate them to the job.</li>
            <li><strong>Why do you want to work here?</strong> - Mention what attracts you to the company.</li>
            <li><strong>Where do you see yourself in five years?</strong> - Discuss your career aspirations and how they align with the company.</li>
            <li><strong>Describe a challenging situation and how you handled it.</strong> - Use the STAR method to structure your response.</li>
            <li><strong>What is your greatest achievement?</strong> - Share a specific accomplishment that demonstrates your skills and values.</li>
            <li><strong>Do you have any questions for us?</strong> - Always have a few questions prepared to show your interest.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'article3',
      title: "Body Language Tips",
      content: (
        <div>
          <p>Understanding body language is crucial during an interview. Here are some tips:</p>
          <ul>
            <li><strong>Maintain Eye Contact:</strong> This shows confidence and engagement.</li>
            <li><strong>Practice a Firm Handshake:</strong> A firm handshake creates a positive first impression.</li>
            <li><strong>Be Aware of Your Posture:</strong> Sit up straight to convey confidence and interest.</li>
            <li><strong>Use Open Gestures:</strong> Avoid crossing your arms; use hand gestures to emphasize points.</li>
            <li><strong>Smile Genuinely:</strong> A warm smile can create a friendly atmosphere.</li>
            <li><strong>Be Mindful of Nervous Habits:</strong> Avoid fidgeting or playing with your hair or clothes.</li>
            <li><strong>Mirror the Interviewer's Body Language:</strong> Subtly matching their gestures can build rapport.</li>
          </ul>
        </div>
      )
    },
  ];
  
  const [activeResource, setActiveResource] = useState(null);

  const handleResourceClick = (id) => {
    // Toggle the clicked resource, if it's already active, close it
    if (activeResource === id) {
      setActiveResource(null);
    } else {
      setActiveResource(id);
    }
  };

  return (
    <div className="home">
        <section className="hero-section">
        <div className="container">
      <div className='hero-content'>
      <h1>Hi, {userName}! Ready to practice?</h1>
      <p>Your AI-powered companion for interview success.</p>
      <button onClick={handlePracticeNow} className="cta-button">Start Practicing</button>
       
      {/* Add text to encourage users to navigate to MyPrepa */}
      <div className="myprepa-prompt">
        <p>Track your progress and review all your practice sessions in the</p>
        <button onClick={handleMyPrepa} className="cta-button">My Practices</button>
        <p> section.</p>
      </div></div></div>
             <div className="floating-shapes">
            <span className="shape"></span>
              <span className="shape"></span>
            <span className="shape"></span>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Prepa Feature</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Personalized Practice Sessions</h3>
              <p>Practice with dynamic interview questions and scenarios customized for your specific field.</p>
            </div>
            <div className="feature-item">
             <h3>Real-time Feedback and Analysis</h3>
             <p>Receive instant feedback during practice sessions to refine your responses.</p>
            </div>
            <div className="feature-item">
           <h3>Video Recording and Playbackk</h3>
             <p>Receive detailed feedback, insights, and suggestions through AI analysis of your interview responses.</p>
             </div>
             <div className="feature-item">
           <h3>Comprehensive Resource Library</h3>
             <p>Receive detailed feedback, insights, and suggestions through AI analysis of your interview responses.</p>
             </div>
          </div>
        </div>
      </section>

      <section className="quick-tips">
  <div className="container">
    <h2>Quick Tips for Success</h2>
    <div className="tips-list">
      <div className="tip-item">
        <h3>Research the Company</h3>
        <p>Learn about the company’s values, culture, and recent developments to tailor your responses.</p>
      </div>
      <div className="tip-item">
        <h3>Practice Common Interview Questions</h3>
        <p>Prepare answers for frequently asked questions to boost your confidence during the interview.</p>
      </div>
      <div className="tip-item">
        <h3>Dress Appropriately</h3>
        <p>Select professional attire that matches the role and company culture to make a positive impression.</p>
      </div>
    </div>
  </div>
</section>


      <section className="resource-library">
        <h2>Resource Library</h2>
        <ul>
          {resources.map((resource) => (
            <li key={resource.id}>
              <button onClick={() => handleResourceClick(resource.id)} className="resource-link">
                {resource.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Render the selected resource content */}
        {activeResource && (
          <div className="resource-content">
            {resources.find(resource => resource.id === activeResource).content}
          </div>
        )}
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2>Watch Our Introduction Video</h2>
        <video className="intro-video" controls>
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Prepa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
