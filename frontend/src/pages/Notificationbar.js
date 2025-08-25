import React from 'react';
import '../styles/Notificationbar.css';

function Notificationbar() {
  return (
    <div className="notificationbar">
      <div className="notificationbar-content">
        <span>Apply now for the Fall '25 Intro Fellowship!</span>
        <a
          className="notificationbar-link"
          href="https://docs.google.com/forms/d/e/1FAIpQLScT6ig0l_TrJuYeR2ae4_9oCzWZXaeEdHCzF7WFqUi25HCiyw/viewform?usp=dialog"
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