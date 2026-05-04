import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';
import Project from './pages/projects/Projects.jsx';
import './App.css';

export default function App() {
  const [isEntered, setIsEntered] = useState(false);

  // ⭐️ 접속하자마자 바로 실행되는 마법의 타이머!
  useEffect(() => {
    // 3000(3초) 뒤에 isEntered를 true로 바꿔서 메인으로 넘깁니다.
    // 준비하신 로딩 GIF 길이에 맞춰 이 숫자를 조절하세요!
    const timer = setTimeout(() => {
      setIsEntered(true);
    }, 5000);

    return () => clearTimeout(timer); // 클린업 (안전장치)
  }, []);

  // 1️⃣ 입장 전: 버튼 없이 바로 뜨는 로딩 GIF 화면
  if (!isEntered) {
    return (
      <div className="loading-screen">
        <div className="gif-container">
          <img
            src={`${import.meta.env.BASE_URL}assets/Loading.gif`}
            alt="Loading..."
            className="loading-gif"
          />
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
        <Route path="/projects/Punggyeong" element={<Punggyeong />} />
        <Route path="/projects/Projects" element={<Project />} />
      </Routes>
    </HashRouter>
  );
}
