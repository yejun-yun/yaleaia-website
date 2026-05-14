import React from 'react';
import '../styles/Notificationbar.css';

function Notificationbar() {
  return (
    <div className="notificationbar">
      <div className="notificationbar-content">
        <span>Apply now for the Summer '26 AI Safety Fellowship!</span>
        <a
          className="notificationbar-link"
          href="https://docs.google.com/forms/d/e/1FAIpQLSc5jqrujQSvH-N9sA7GN4bI1iBtV_YXxpnNxFuV4VYVlBT7nw/viewform?usp=sharing&ouid=109623917252404388178"
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
