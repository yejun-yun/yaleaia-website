import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Involve from './pages/Involve';
import Footer from './pages/Footer';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/involve" element={<Involve />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
