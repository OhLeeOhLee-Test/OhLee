import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Home from './pages/home/Home.jsx';
import Punggyeong from './pages/projects/Punggyeong/Punggyeong.jsx';

export default function App() {
  return (
    // ⭐️ HashRouter가 깃허브 배포 시 주소 에러를 막아줍니다!
    <HashRouter>
      {/* 헤더는 어느 방을 가든 항상 위에 떠 있어야 하므로 Routes 밖에 둡니다 */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects/Punggyeong/Punggyeong"
          element={<Punggyeong />}
        />
      </Routes>
    </HashRouter>
  );
}
