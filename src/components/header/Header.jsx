import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 주소 확인용
  const toggleMenu = () => setIsOpen(!isOpen);

  // ⭐️ 섹션 이동 전령 함수 완벽 수정!
  const navTo = (index) => {
    setIsOpen(false);
    
    // 현재 우리가 홈(/)이나 프로젝트 화면에 있을 때는 애니메이션을 위해 신호만 쏩니다!
    const currentPath = location.pathname;
    if (currentPath === '/' || currentPath === '/projects/Projects') {
      window.dispatchEvent(new CustomEvent('navToSection', { detail: index }));
    } else {
      // 만약 상세 실험 페이지(/project/fluid 등)에 있다면 애니메이션 없이 즉시 이동
      if (index === 0 || index === 2) navigate('/');
      if (index === 1) navigate('/projects/Projects');
    }
  };

  return (
    <header className="global-header">
      <div className="header-content">
        <div onClick={() => navTo(0)} className="logo-text" style={{cursor: 'pointer'}}>OhLee</div>
        <nav className={`header-nav ${isOpen ? 'show' : ''}`}>
          <ul>
            <li><div onClick={() => navTo(0)} style={{cursor: 'pointer'}}>Home</div></li>
            <li><div onClick={() => navTo(1)} style={{cursor: 'pointer'}}>Projects</div></li>
            <li><div onClick={() => navTo(2)} style={{cursor: 'pointer'}}>Contact</div></li>
          </ul>
        </nav>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}