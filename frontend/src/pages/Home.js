import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useInView } from 'react-intersection-observer';
import '../styles/Home.css';

const FeatureCard = ({ icon, title, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className={`feature-card ${inView ? 'visible' : ''}`}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};


function Home() {
  return (
    <div className="home">
      <Helmet>
        <title>Yale AI Alignment</title>
        <meta 
          name="description" 
          content="Dedicated to reducing catastrophic risks from advanced AI." 
        />
      </Helmet>
      
      <section className="hero">
        <div className="hero-content">
        <h1 style={{color: 'inherit'}}>Yale AI Alignment</h1>
          <p className="hero-subtitle">Managing risks from advanced artificial intelligence is one of the most important problems of our time. We are a community at Yale aimed at reducing these risks and steering the trajectory of AI development for the better.</p>
          <p className="hero-subtitle">We run a semester-long introductory technical intro fellowship on AI safety research, covering topics like neural network interpretability, learning from human feedback, goal misgeneralization in reinforcement learning agents, eliciting latent knowledge, and evaluating dangerous capabilities in models.</p>
          <div className="hero-buttons">
            <Link to="https://forms.gle/vmNG2pdZBcdwdU1X6" className="primary-button" target="_blank" rel="noopener noreferrer">YAIA Interest Form</Link>
            <Link to="https://join.slack.com/t/yaleaialignment/shared_invite/zt-2tbqdofqr-AyCDedQdqxYtToi994IR6w" className="secondary-button" target="_blank" rel="noopener noreferrer">YAIA Community Slack</Link>
          </div>
        </div>
      </section>

     
    </div>
  );
}

export default Home;