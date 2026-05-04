import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';
import Project from './pages/projects/Projects.jsx';
import './App.css';

export default function App() {
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    // 1️⃣ 로딩 화면이 도는 3초 동안, 무거운 핵심 이미지들을 미리 다운로드합니다! (Preload)
    const imagesToPreload = [
      `${import.meta.env.BASE_URL}assets/Windmill_body.png`,
      `${import.meta.env.BASE_URL}assets/Windmill_wing.png`,
      `${import.meta.env.BASE_URL}assets/Mailbox.png`,
      `${import.meta.env.BASE_URL}assets/Tree.png`,
      // 필요하다면 오리나 다른 배경 이미지도 여기에 추가하세요!
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src; // 브라우저가 뒤에서 몰래 이미지를 불러와서 기억해둡니다.
    });

    // 2️⃣ 3000(3초) 뒤에 메인으로 넘깁니다. (이미지 준비 완료!)
    const timer = setTimeout(() => {
      setIsEntered(true);
    }, 3000);

    return () => clearTimeout(timer); // 클린업
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
