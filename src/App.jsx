import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';
import './App.css'; // ⭐️ 로딩 화면 디자인

export default function App() {
  const [isEntered, setIsEntered] = useState(false);

  // 1️⃣ 입장 전: 깔끔한 인트로 화면
  if (!isEntered) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-title">OhLee</h1>
          <p className="loading-subtitle">Engineering Lab</p>
          <button className="enter-btn" onClick={() => setIsEntered(true)}>
            입장하기
          </button>
        </div>
      </div>
    );
  }

  // 2️⃣ 입장 후: 메인 포트폴리오
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/punggyeong" element={<Punggyeong />} />
      </Routes>
    </HashRouter>
  );
}