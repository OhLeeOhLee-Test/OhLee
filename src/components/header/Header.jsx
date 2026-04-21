import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);

  // ⭐️ 섹션 이동 전령 함수
  const navTo = (index) => {
    setIsOpen(false);
    // 1. 먼저 홈으로 이동
    navigate('/');
    // 2. 홈에 있는 오리와 섹션들에게 몇 번으로 갈지 알림
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navToSection', { detail: index }));
    }, 50); // 페이지 전환 시간을 고려한 미세한 지연
  };

  return (
    <>
      <header className="global-header">
        {/* ⭐️ 로고 클릭 시 0번 섹션으로 */}
        <div
          onClick={() => navTo(0)}
          className="logo-text"
          style={{ cursor: 'pointer' }}
        >
          OhLee
        </div>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
      </header>

      <nav className={`fullscreen-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <div onClick={() => navTo(0)} style={{ cursor: 'pointer' }}>
              Home
            </div>
          </li>
          {/* ⭐️ 프로젝트 클릭 시 1번 섹션으로 */}
          <li>
            <div onClick={() => navTo(1)} style={{ cursor: 'pointer' }}>
              Projects
            </div>
          </li>
          {/* ⭐️ 컨택트 추가: 클릭 시 2번 섹션으로 */}
          <li>
            <div onClick={() => navTo(2)} style={{ cursor: 'pointer' }}>
              Contact
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
