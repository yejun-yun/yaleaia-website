import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Involve from './pages/Involve';
import Curriculum from './pages/Curriculum';
import Footer from './pages/Footer';
import { ThemeProvider } from './ThemeContext';
import './styles/App.css';

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
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
