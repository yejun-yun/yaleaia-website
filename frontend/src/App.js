import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home, { INTEREST_FORM_URL } from './pages/Home';
import About from './pages/About';
import Involve from './pages/Involve';
import Curriculum from './pages/Curriculum';
import Footer from './pages/Footer';
import { ThemeProvider } from './ThemeContext';
import './styles/App.css';

// Stable /apply address (also handled at the edge via public/_redirects
// and pre-React via an inline script in index.html); this covers #/apply.
function ApplyRedirect() {
  useEffect(() => {
    window.location.replace(INTEREST_FORM_URL);
  }, []);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/involve" element={<Involve />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/apply" element={<ApplyRedirect />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
