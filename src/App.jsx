import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Punggyeong from './pages/Projects/Punggyeong';
import Web from './pages/Projects/Web';
import Contact from './pages/Contact';
import LoadingScreen from './LoadingScreen';
import './App.css';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2초 후 실행
    return () => clearTimeout(timer);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="logo" onClick={() => goTo('/')}>
          OHLEEOHLEE
        </div>
        <div
          className="menu-trigger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </div>
      </header>

      <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
        <span onClick={() => goTo('/')}>HOME</span>
        <span onClick={() => goTo('/projects')}>PROJECTS</span>
        <span onClick={() => goTo('/contact')}>CONTACT</span>
      </nav>

      <div className="portfolio-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/punggyeong" element={<Punggyeong />} />
          <Route path="/web" element={<Web />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/Test_Web/">
      <AppContent />
    </BrowserRouter>
  );
}
