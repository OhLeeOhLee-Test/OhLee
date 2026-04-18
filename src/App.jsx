import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';

// ⭐️ 예환님이 알려주신 '진짜' 파일 위치로 수입(import) 경로를 고쳤습니다!
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';

export default function App() {
  return (
    <HashRouter>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* ⭐️ 목적지 주소: Home.jsx에서 navigate('/project/punggyeong') 한 곳이 바로 여기입니다! */}
        <Route path="/project/punggyeong" element={<Punggyeong />} />
      </Routes>
    </HashRouter>
  );
}
