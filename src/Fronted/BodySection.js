import React, { useState } from 'react';
import './BodySection.css';

const BodySection = ({ openAuthModal }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a WhatsApp message link
    const phoneNumber = '+918104479942'; // Replace with your target phone number
    const message = `Name: ${contactForm.name}\nEmail: ${contactForm.email}\nMessage: ${contactForm.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <main>
      <section id="home" className="home-section"></section>
      {/* Hero Section */}
      <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <h1>Prepare for Success with Prepa</h1>
                    <p>Enhance your interview skills with AI-powered coaching and real-time feedback.</p>
                    <button onClick={() => openAuthModal('signup')} className="cta-button">Let's Practise</button>
                </div>
                <div className="hero-image">
                     <video
            src={require('./assets/hero.mp4')} // Adjust the path based on your folder structure
                autoPlay
              loop
              muted
              playsInline
               style={{ width: '100%', height: 'auto', objectFit: 'cover' }} // Adjust styles as needed
              />
            </div>

            </div>
            <div className="floating-shapes">
                <span className="shape"></span>
                <span className="shape"></span>
                <span className="shape"></span>
            </div>
        </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Prepa?</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Real-Time Feedback</h3>
              <p>Receive instant feedback during practice sessions to refine your responses.</p>
            </div>
            <div className="feature-item">
             <h3>Tailored Interview Practices</h3>
               <p>Practice with dynamic interview questions and scenarios customized for your specific field.</p>
            </div>
            <div className="feature-item">
           <h3>AI-Driven Performance Feedback</h3>
             <p>Receive detailed feedback, insights, and suggestions through AI analysis of your interview responses.</p>
             </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>Step 1: Sign Up</h3>
              <p>Create your account or Signup or Sign In with Google .</p>
            </div>
            <div className="step">
              <h3>Step 2: Choose Scenarios</h3>
              <p>Choose interview scenarios tailored to your industry and career goals.</p>
            </div>
            <div className="step">
              <h3>Step 3: Practice & Improve</h3>
              <p>Engage in practice sessions and receive real-time feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>About Prepa</h2>
          <p>
         Prepa is an innovative AI-powered interview preparation platform created to revolutionize the way candidates
         approach their interviews. Designed to cater to a wide array of users, from job seekers to students preparing 
         for academic evaluations, Prepa offers a comprehensive suite of features aimed at refining your interview skills. 
         Whether you are interviewing for your dream job, applying for graduate programs, or preparing for industry-specific 
         roles, Prepa ensures you are equipped with the tools necessary to succeed.
         </p>
         <p>
         What sets Prepa apart is its ability to provide customizable, realistic interview scenarios tailored to your chosen 
         field or role. These scenarios cover everything from behavioral interviews to technical assessments, simulating a 
          real-life interview experience. The platform provides real-time AI-driven feedback on your performance, helping you 
         identify your strengths and areas for improvement. Our advanced AI analyzes your answers, voice modulation, body 
         language, and other factors to offer actionable insights, allowing you to refine your skills after every session.
         </p>
         <p>
         Prepa was founded by <u><strong><i><span style={{color: '#007bff'}}>Shravankumar Bhavrlal Patel</span></i></strong></u>, a student of Final Year B.Sc Computer Science, with the vision of empowering individuals to overcome interview 
         anxiety and boost their confidence. By integrating artificial intelligence, we aim to offer personalized, intelligent 
          coaching that adapts to the user’s progress. The platform stores your practice sessions, tracks your development 
         over time, and provides detailed analytics that guide you towards improvement with every practice round. 
         Whether you are a fresh graduate or a seasoned professional, Prepa’s intuitive design ensures that users of all 
         levels can benefit from its powerful features.
         </p>
          <p>
           At Prepa, our mission is to empower every individual to achieve their career aspirations. We believe that by 
           providing our users with an edge in their interview preparation, we enable them to unlock new career opportunities 
           and achieve their goals. Our platform is more than just a tool—it's a personal coach dedicated to your success.
          </p>

        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="container">
        <h2>Prepa Blog</h2>
<article>
  <h3>Why AI-Powered Interview Coaching is the Future of Preparation</h3>
  <p>
    In an ever-evolving job market, standing out during interviews is no longer optional—it's a necessity. Traditional interview 
    preparation methods often fall short in equipping candidates with the personalized insights they need to improve. 
    That's where AI-powered platforms like <strong><span style ={{color :'#007bff' }}>Prepa</span></strong> (derived from "Preparation") come into play, 
    revolutionizing the way we prepare for interviews. Prepa is designed to simulate real-world interview scenarios while leveraging 
    cutting-edge artificial intelligence to provide real-time feedback, helping candidates prepare more efficiently than ever before.
  </p>
  <p>
    With Prepa, users can choose customizable interview scenarios tailored to their field of interest, from technology and healthcare 
    to finance and beyond. The platform’s intelligent AI analyzes everything from speech patterns and tone to body language and 
    content, offering precise, actionable insights. For instance, after each interview session, Prepa highlights areas for improvement, 
    whether it’s refining communication skills, enhancing confidence, or adjusting the pacing of responses.
  </p>
  <p>
    One of the key advantages of Prepa is its ability to track your progress over time. Users can see how their interview performance 
    evolves with each session, identifying specific areas of growth and areas that require more focus. This feedback loop ensures that 
    you're always improving and moving closer to acing your next interview—whether it's for a job, academic program, or a high-stakes 
    evaluation.
  </p>
  <p>
    At Prepa, we believe that preparation is the key to confidence. Our AI-powered insights empower you to walk into any interview 
    room with the knowledge that you're prepared for anything that comes your way. With personalized coaching, scenario-based training, 
    and performance analytics, Prepa is your partner in transforming preparation into success.
  </p>
  <p>
    So, if you're ready to take your interview skills to the next level, it's time to try Prepa and experience the future of 
    interview coaching for yourself.
  </p>
</article>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Ace Your Interviews?</h2>
          <p>Join Prepa today and take the first step towards interview success!</p>
          <button onClick={() => openAuthModal('signup')} className="cta-button">Sign Up Now</button>
        </div>
      </section>
    </main>
  );
};

export default BodySection;
