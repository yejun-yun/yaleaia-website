import React from 'react';
import '../styles/Notificationbar.css';

function Notificationbar() {
  return (
    <div className="notificationbar">
      <div className="notificationbar-content">
        <span>Apply now for the Spring '26 Intro Fellowship!</span>
        <a
          className="notificationbar-link"
          href="https://forms.gle/rMbm7rfHfFFx1mek6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply
        </a>
      </div>
    </div>
  );
}

export default Notificationbar