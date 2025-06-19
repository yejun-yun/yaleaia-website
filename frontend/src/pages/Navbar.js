import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='navbar-container'>
      <nav className="navbar">
        <div className="navbar-logo">
          <picture>
            <img 
              src="/logo512.png" 
              alt="YAIA Logo" 
              style={{
                height: "120px", 
                marginRight: "10px", 
                verticalAlign: "middle"
              }} 
            />
          </picture>
        </div>
        
        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          style={{ display: 'none' }}
        >
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/involve" onClick={() => setIsMenuOpen(false)}>Get Involved</Link>
          <Link to="/chat" onClick={() => setIsMenuOpen(false)}>AI Chat</Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar