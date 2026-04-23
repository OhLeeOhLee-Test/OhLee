import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './Projects.css';

export default function Project() {
  const navigate = useNavigate();

  // ⭐️ 1. 티켓 유무를 화면 렌더링 전에 확인합니다!
  const [shouldPlayIris] = useState(
    () => sessionStorage.getItem('playIris') === 'true'
  );

  useLayoutEffect(() => {
    if (shouldPlayIris) {
      sessionStorage.removeItem('playIris');
      gsap.set('.iris-overlay', {
        display: 'block',
        width: '0px',
        height: '0px',
      });
      gsap.to('.iris-overlay', {
        width: '300vmax',
        height: '300vmax',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => gsap.set('.iris-overlay', { display: 'none' }),
      });
    }
  }, [shouldPlayIris]);

  // ⭐️ 2. 오류의 핵심 해결: 무조건 '/' 로 보냅니다.
  const handleExit = (targetIndex) => {
    if (targetIndex === 1) return; // 자기를 누르면 무시

    sessionStorage.setItem('playIris', 'true');
    // 컨택트를 눌렀다면 메모장을 남겨둡니다
    if (targetIndex === 2) sessionStorage.setItem('goToContact', 'true');

    gsap.set('.iris-overlay', {
      display: 'block',
      width: '300vmax',
      height: '300vmax',
    });
    gsap.to('.iris-overlay', {
      width: '0px',
      height: '0px',
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        // 무조건 Home으로 보냄! Home이 알아서 판단합니다.
        navigate('/');
      },
    });
  };

  useEffect(() => {
    const onNavSignal = (e) => handleExit(e.detail);
    window.addEventListener('navToSection', onNavSignal);
    return () => window.removeEventListener('navToSection', onNavSignal);
  }, [navigate]);

  const projectList = [
    {
      id: 1,
      title: 'Worthington Jet 실험',
      desc: '유체역학 물방울 충돌 및 ImageJ 분석',
      path: '/project/fluid',
    },
    {
      id: 2,
      title: '자동화 매크로 스크립트',
      desc: 'AutoHotkey 기반 작업 효율화',
      path: '/project/macro',
    },
    {
      id: 3,
      title: '수학 난제 증명 논문',
      desc: 'LaTeX 문서화 및 저널 투고 준비',
      path: '/project/math',
    },
    {
      id: 4,
      title: '풍경풍경 (Scenery)',
      desc: '자연물과 오리의 스톱모션 웹 무대',
      path: '/projects/Punggyeong',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="storage-container">
      <button className="back-btn" onClick={() => handleExit(0)}>
        ← 무대로 돌아가기
      </button>

      <div className="storage-header">
        <h1>🥒 오이 저장소</h1>
        <p>좌우로 스와이프하여 신선한 프로젝트를 확인하세요!</p>
      </div>

      <div className="cucumber-slider">
        {projectList.map((proj) => (
          <div
            key={proj.id}
            className="cucumber-card"
            onClick={() => navigate(proj.path)}
          >
            <div className="cucumber-image-placeholder">
              <span style={{ fontSize: '5rem' }}>🥒</span>
            </div>
            <div className="cucumber-info">
              <h2>{proj.title}</h2>
              <p>{proj.desc}</p>
              <span className="enter-text">자세히 보기 →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐️ 가장 중요: 티켓 상태에 따라 초기 CSS를 미리 세팅! */}
      <div
        className="iris-overlay"
        style={{
          display: shouldPlayIris ? 'block' : 'none',
          width: '0px',
          height: '0px',
        }}
      ></div>
    </div>
  );
}
