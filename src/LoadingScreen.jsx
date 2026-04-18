import React from 'react';

export default function LoadingScreen({ isFadingOut }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: '#09090b',
        color: 'white',
        overflow: 'hidden',
        fontFamily: '"Helvetica Neue", sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999, // 👈 화면 맨 위에 고정
        // ⭐️ 핵심: 신호가 오면 0.5초 동안 투명해집니다.
        transition: 'opacity 0.5s ease-in-out',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto', // 투명해지면 클릭 방해 금지
      }}
    >
      <style>
        {`
          /* 1. 아이콘 연속 홀로그램 팝업 애니메이션 */
          @keyframes iconHologram {
            0% { opacity: 0; transform: scale(0.5) translateY(20px); }
            20% { opacity: 1; transform: scale(1.1) translateY(0); filter: drop-shadow(0 0 12px currentColor); }
            80% { opacity: 1; transform: scale(1) translateY(0); filter: drop-shadow(0 0 4px currentColor); }
            100% { opacity: 0; transform: scale(0.8) translateY(-20px); }
          }

          /* 2. 모자 투척 및 바운스 (스프링 효과) */
          @keyframes hatThrow {
            0% { opacity: 0; transform: translateY(-150px) rotate(-15deg) scale(0.8); }
            30% { opacity: 1; transform: translateY(-180px) rotate(10deg) scale(1.1); } /* 최고점 */
            65% { transform: translateY(0px) rotate(0deg) scale(1); } /* 머리에 안착 */
            80% { transform: translateY(-15px) rotate(0deg) scale(1); } /* 통! 튕김 */
            100% { opacity: 1; transform: translateY(0px) rotate(0deg) scale(1); } /* 최종 안착 */
          }

          /* 3. 실루엣 등장 */
          @keyframes personFadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* 4. 철학을 담은 텍스트 등장 */
          @keyframes textReveal {
            0%, 60% { opacity: 0; letter-spacing: 0px; filter: blur(4px); }
            100% { opacity: 1; letter-spacing: 4px; filter: blur(0px); }
          }

          .icon-base {
            position: absolute; left: 50%; top: 30%;
            margin-left: -32px; width: 64px; height: 64px;
            opacity: 0;
          }
        `}
      </style>

      {/* 무대 세팅 */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        {/* 1. 톱니바퀴 (Engineering - Cyan) */}
        <svg
          className="icon-base"
          style={{
            animation: 'iconHologram 0.5s ease-out 0.1s forwards',
            color: '#00f0ff',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>

        {/* 2. 번개 (Energy/Software - Amber) */}
        <svg
          className="icon-base"
          style={{
            animation: 'iconHologram 0.5s ease-out 0.5s forwards',
            color: '#ffb800',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>

        {/* 3. 스마일/사람 (Design/Humanity - Purple) */}
        <svg
          className="icon-base"
          style={{
            animation: 'iconHologram 0.5s ease-out 0.9s forwards',
            color: '#b026ff',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>

        {/* 4. 팔레트/노트 (Art/Creation - Emerald) */}
        <svg
          className="icon-base"
          style={{
            animation: 'iconHologram 0.5s ease-out 1.3s forwards',
            color: '#00ff88',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>

        {/* 사람 실루엣 (미니멀) */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            marginLeft: '-40px',
            animation:
              'personFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards',
            opacity: 0,
          }}
        >
          <svg
            width="80"
            height="100"
            viewBox="0 0 80 100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="40" cy="20" r="14" fill="#111"></circle>
            <path d="M20 90V60a20 20 0 0 1 40 0v30" fill="#111"></path>
          </svg>
        </div>

        {/* 모자 (미니멀 볼캡/페도라) */}
        <div
          style={{
            position: 'absolute',
            bottom: '68px',
            left: '50%',
            marginLeft: '-30px',
            animation:
              'hatThrow 0.8s cubic-bezier(0.5, -0.5, 0.2, 1.5) 1.5s forwards',
            opacity: 0,
          }}
        >
          <svg width="60" height="40" viewBox="0 0 60 40" fill="#ffffff">
            {/* 챙 */}
            <rect x="5" y="25" width="50" height="4" rx="2"></rect>
            {/* 머리통 부분 */}
            <path d="M15 25 C 15 10, 20 5, 30 5 C 40 5, 45 10, 45 25 Z"></path>
          </svg>
        </div>
      </div>

      {/* 세계관 텍스트 */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'textReveal 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '500',
            margin: '0 0 8px 0',
            color: '#fff',
          }}
        >
          OhLeeOhLee
        </h2>
        <p
          style={{
            fontSize: '11px',
            color: '#888',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Boundless Engineering & Design
        </p>
      </div>
    </div>
  );
}
