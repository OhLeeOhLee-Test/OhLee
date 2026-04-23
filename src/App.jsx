import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';
import Project from './pages/projects/Projects.jsx';
import './App.css'; // ⭐️ 로딩 화면 스타일 불러오기

export default function App() {
  const [isEntered, setIsEntered] = useState(false);

  // ⭐️ 입장 버튼을 눌렀을 때 실행 (권한 요청)
  const handleEnter = async () => {
    // 아이폰(iOS 13+) 기울기 센서 권한 요청
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permissionState =
          await DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          console.log('기울기 센서 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.error('권한 요청 에러:', error);
      }
    }

    // 권한 허용 여부와 상관없이 일단 포트폴리오로 입장!
    setIsEntered(true);
  };

  // 1️⃣ 입장 전: 로딩 화면 (안내문 포함)
  if (!isEntered) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-title">OhLee</h1>
          <p className="loading-subtitle">Engineering Lab</p>
          <button className="enter-btn" onClick={handleEnter}>
            입장하기 (Enter)
          </button>
          {/* ⭐️ 친절한 안내문 부활! */}
          <p className="loading-notice">
            ※ 최적의 경험을 위해 기기 센서와 소리를 사용합니다.
          </p>
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
