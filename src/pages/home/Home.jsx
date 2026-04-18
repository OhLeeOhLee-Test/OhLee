import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './duck/Duck.jsx';
import './Home.css';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export default function Home() {
  const homeRef = useRef();
  const navigate = useNavigate();
  const tlRef = useRef(); // 타임라인을 외부에서도 제어하기 위해 ref로 보관
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // ⭐️ 1. 초기 상태 설정
      // 프로젝트 패널은 아래에, 컨택트 패널은 오른쪽에, 땅은 바닥 아래에 숨깁니다.
      gsap.set('.project-panel', { yPercent: 100 });
      gsap.set('.contact-panel', { xPercent: 100 });
      gsap.set('.ground', { yPercent: 100 });

      // ⭐️ 2. 전체 타임라인 설계 (줌아웃 -> 땅 위 안착 -> 옆으로 이동)
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: 'power2.inOut' },
      });
      tlRef.current = tl;

      tl.addLabel('step0')
        // 1단계: 홈 -> 프로젝트 (오리 작아지며 왼쪽 땅 위로 안착)
        .to('.home-panel', { yPercent: -100 }, 'step1')
        .to('.project-panel', { yPercent: 0 }, 'step1')
        .to('.ground', { yPercent: 0 }, 'step1')
        .to('.duck-container', { scale: 0.4, x: '-35vw', y: '20vh' }, 'step1')
        .addLabel('step1')

        // 2단계: 프로젝트 -> 컨택트 (오리가 땅 위를 걸어서 오른쪽으로 이동)
        .to('.project-panel', { xPercent: -100 }, 'step2')
        .to('.contact-panel', { xPercent: 0 }, 'step2')
        .to('.duck-container', { x: '35vw' }, 'step2')
        .addLabel('step2');

      // ⭐️ 3. 섹션 이동 함수
      const goToSection = (newIndex) => {
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;
        currentIndexRef.current = newIndex;

        // 오리에게 현재 섹션 번호 전달 (시선 고정용)
        document.body.setAttribute('data-section', newIndex);
        window.dispatchEvent(
          new CustomEvent('sectionChange', { detail: newIndex })
        );

        tl.tweenTo(`step${newIndex}`, {
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      };

      // ⭐️ 4. 마우스 휠 및 터치 감지 (Observer)
      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 10,
        preventDefault: true,
        onDown: () => {
          if (currentIndexRef.current < 2)
            goToSection(currentIndexRef.current + 1);
        },
        onUp: () => {
          if (currentIndexRef.current > 0)
            goToSection(currentIndexRef.current - 1);
        },
      });

      // ⭐️ 5. 헤더(Header.jsx)에서 보내는 네비게이션 신호 수신
      const handleNavSignal = (e) => {
        const targetSection = e.detail;
        if (currentIndexRef.current !== targetSection) {
          goToSection(targetSection);
        }
      };
      window.addEventListener('navToSection', handleNavSignal);

      return () => {
        window.removeEventListener('navToSection', handleNavSignal);
      };
    }, homeRef);

    return () => ctx.revert();
  }, []);

  // 홈 화면에 들어올 때 스크롤을 막아주는 안전장치
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="home-container" ref={homeRef}>
      <Duck />

      {/* 배경 땅 */}
      <div className="ground"></div>

      <div className="panels-container">
        {/* 섹션 0: 홈 */}
        <section className="panel home-panel">
          <h1>Engineering Lab</h1>
          <p>휠을 아래로 내려보세요 ↓</p>
        </section>

        {/* 섹션 1: 프로젝트 */}
        <section className="panel project-panel">
          <h2>Projects</h2>
          <div className="project-list">
            <div
              className="project-card"
              onClick={() => navigate('/project/punggyeong')}
              style={projectCardStyle}
            >
              <h3>풍경풍경 (Scenery)</h3>
              <p>자세히 보기 →</p>
            </div>
          </div>
        </section>

        {/* 섹션 2: 컨택트 */}
        <section className="panel contact-panel">
          <div className="contact-card" style={contactStyles.card}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              Contact Me
            </h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              함께 재미있는 프로젝트를 만들어봐요!
            </p>

            <form style={contactStyles.form}>
              <input
                type="text"
                placeholder="성함 (Name)"
                style={contactStyles.input}
              />
              <input
                type="email"
                placeholder="이메일 (Email)"
                style={contactStyles.input}
              />
              <textarea
                placeholder="메시지를 남겨주세요."
                style={contactStyles.textarea}
              ></textarea>
              <button type="button" style={contactStyles.button}>
                보내기
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

// 간단한 스타일링 객체
const projectCardStyle = {
  cursor: 'pointer',
  padding: '40px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  marginTop: '20px',
};

const contactStyles = {
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '350px',
    textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    height: '80px',
    resize: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
