import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';
import './App.css'; // ⭐️ 로딩 화면 디자인을 위해 다시 소환!

export default function App() {
  const [isEntered, setIsEntered] = useState(false);

  // ⭐️ 입장 버튼을 눌렀을 때 실행되는 마법의 함수
  const handleEnter = async () => {
    // 아이폰(iOS 13+) 기울기 센서 권한 요청 로직
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          console.log('기울기 센서 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.error('권한 요청 에러:', error);
      }
    }
    
    // 권한을 얻었든 안드로이드라서 상관없든, 포트폴리오 메인 화면으로 입장!
    setIsEntered(true);
  };

  // 1️⃣ 입장 전: 로딩(인트로) 화면만 보여줍니다
  if (!isEntered) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-title">OhLee</h1>
          <p className="loading-subtitle">Engineering Lab</p>
          <button className="enter-btn" onClick={handleEnter}>
            입장하기 (Enter)
          </button>
          <p className="loading-notice">※ 최적의 경험을 위해 기기 센서와 소리를 사용합니다.</p>
        </div>
      </div>
    );
  }

  // 2️⃣ 입장 후: 원래 우리가 만들던 진짜 포트폴리오를 보여줍니다
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