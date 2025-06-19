import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Involve from './pages/Involve';
import Events from './pages/Events';
import Contact from './pages/Contact';
import ChatPage from './pages/ChatPage';
import Footer from './pages/Footer';
import Notificationbar from './pages/Notificationbar';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <Notificationbar />
            <Navbar />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/involve" element={<Involve />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
