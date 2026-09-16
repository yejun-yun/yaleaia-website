import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import LogoMorph, { COLLAPSE_AT } from '../components/LogoMorph';
import { useTheme } from '../ThemeContext';
import { INTEREST_FORM_URL } from './Home';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPill, setIsPill] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setIsPill(window.scrollY > COLLAPSE_AT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${isPill ? ' is-pill' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" onClick={closeMenu} className="navbar-logo" aria-label="Yale AI Alignment — home">
          <LogoMorph />
        </Link>

        <div className="navbar-right">
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={closeMenu}>About</Link>
            <Link to="/involve" onClick={closeMenu}>Programs</Link>
            <a
              className="navbar-cta"
              href={INTEREST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Interest form →
            </a>
            <button
              className="theme-switch"
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Dark theme"
              onClick={toggleTheme}
            >
              <span className="theme-switch-knob" aria-hidden="true" />
            </button>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
