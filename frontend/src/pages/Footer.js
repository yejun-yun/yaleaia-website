import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/logo512.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img 
            src={logo} 
            alt="YAIA Logo" 
            className="footer-logo"
            style={{
              height: "180px",
              width: "auto",
              maxWidth: "100%"
            }}
          />
          <p>Shaping the future of AI safety</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/involve">Get Involved</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="https://forms.gle/vmNG2pdZBcdwdU1X6" target="_blank" rel="noopener noreferrer">Interest Form</a></li>
            <li><a href="https://join.slack.com/t/yaleaialignment/shared_invite/zt-2tbqdofqr-AyCDedQdqxYtToi994IR6w" target="_blank" rel="noopener noreferrer">Slack</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p> Subsidiary of Yale Effective Altruism. 
          This website is published by Yale College students and Yale University is not responsible for its contents. The activities on this website are not supervised or endorsed by Yale and information contained on this website does not necessarily reflect the opinions or official positions of the University. All rights are reserved to Yale University for the Yale name and trademark. </p>
      </div>
    </footer>
  );
}

export default Footer;