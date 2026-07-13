import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import Lettermark from '../components/Lettermark';
import { INTEREST_FORM_URL } from './Home';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Lettermark className="footer-logo" />
          <div className="footer-location">New Haven, CT</div>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <Link to="/">About</Link>
            <Link to="/involve">Programs</Link>
            <a
              className="footer-cta"
              href={INTEREST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Interest form
            </a>
          </div>
          <div className="footer-column faint">
            <span>© 2026 Yale AI Alignment</span>
            <a href="mailto:yale.ai.alignment@gmail.com">Contact us</a>
          </div>
        </div>
      </div>
      <div className="footer-disclaimer">
        <p>
          This website is published by Yale College students and Yale
          University is not responsible for its contents. The activities on
          this website are not supervised or endorsed by Yale and information
          contained on this website does not necessarily reflect the opinions
          or official positions of the University. All rights are reserved to
          Yale University for the Yale name and trademark.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
