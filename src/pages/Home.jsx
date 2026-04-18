import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  // ⭐️ 0에서 1 사이의 스크롤 진행률(Progress)을 저장합니다.
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // (현재 스크롤 위치) / (전체 스크롤 가능 높이)
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY / totalScroll;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="hero-page-wrapper">
      {/* ⭐️ 1. 메인 글씨 영역: 화면에 꽉 차게 고정됩니다. */}
      <section className="fixed-hero-content">
        <div className="hero-content">
          <div className="hero-badge">AEROSPACE & MECHANICAL ENGINEERING</div>
          <h1 className="hero-title">
            EXPLORE THE <br />
            <span>PHYSICS</span> OF DESIGN
          </h1>
          <p className="hero-subtitle">
            유체역학의 미세한 파동부터 정밀한 1-DOF 기구 설계까지. <br />
            이론적 한계를 넘어 실제를 구현하는 연구실입니다.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate('/projects')}
            >
              VIEW PROJECTS
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate('/contact')}
            >
              CONTACT LAB
            </button>
          </div>
        </div>
      </section>

      {/* ⭐️ 2. 오리 트랙: 진행률에 따라 0%에서 90%까지 이동합니다. */}
      <div className="subway-track">
        <div
          className="subway-duck"
          // progress가 1일 때(끝까지 내렸을 때) 90vw(오른쪽 끝)에 도달하도록 설정
          style={{ left: `${scrollProgress * 95}%` }}
        >
          🦆
        </div>
      </div>

      {/* ⭐️ 3. 스크롤을 발생시키기 위한 빈 공간 (투명한 레일 역할을 합니다) */}
      <div className="scroll-spacer"></div>
    </main>
  );
}
