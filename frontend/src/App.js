import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home, { INTEREST_FORM_URL } from './pages/Home';
import Involve from './pages/Involve';
import Curriculum from './pages/Curriculum';
import Footer from './pages/Footer';
import { ThemeProvider } from './ThemeContext';
import './styles/App.css';

// Stable /apply address (also handled at the edge via public/_redirects
// and pre-React via an inline script in index.html).
function ApplyRedirect() {
  useEffect(() => {
    window.location.replace(INTEREST_FORM_URL);
  }, []);
  return null;
}

// The site used hash routing until Sept 2026, so links like
// yaleaia.org/#/involve are still out in the wild. Rewrite them to the
// clean path once, on load.
function LegacyHashRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const { hash } = window.location;
    if (hash.startsWith('#/')) {
      navigate(hash.slice(1), { replace: true });
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <LegacyHashRedirect />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/involve" element={<Involve />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/apply" element={<ApplyRedirect />} />
            {/* stale links (e.g. the old /about) land on the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
