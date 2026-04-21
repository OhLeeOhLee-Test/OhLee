import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './duck/Duck.jsx';
import './Home.css';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export default function Home() {
  const homeRef = useRef();
  const navigate = useNavigate();
  const tlRef = useRef();
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // ⭐️ 현재 시간에 따른 '해(Sun)' 위치 계산기
  const [sunStyle, setSunStyle] = useState({});
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const updateSun = () => {
      const hour = new Date().getHours();
      // 아침 6시 ~ 저녁 7시(19시)를 낮으로 설정
      if (hour >= 6 && hour < 19) {
        setIsDay(true);
        const progress = (hour - 6) / 13; // 0(아침) ~ 1(저녁) 사이의 비율
        setSunStyle({
          // 시간에 따라 왼쪽(10vw)에서 오른쪽(80vw)으로 이동
          left: `${10 + progress * 70}vw`,
          // 포물선 궤적 (한낮엔 높이 뜨고 아침/저녁엔 내려감)
          top: `${40 - Math.sin(progress * Math.PI) * 30}vh`,
        });
      } else {
        setIsDay(false); // 밤에는 해를 숨김 (혹은 나중에 달을 넣어도 됩니다!)
      }
    };
    updateSun(); // 처음 렌더링될 때 한 번 실행
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // ⭐️ 1. 초기 상태 설정
      // 프로젝트 패널은 아래에, 컨택트 패널은 오른쪽에, 땅은 바닥 아래에 숨깁니다.
      gsap.set('.project-panel', { yPercent: 100 });
      gsap.set('.contact-panel', { xPercent: 100 });
      gsap.set('.ground', { yPercent: 100 });

      // ⭐️ 1. 2단계 오리 우측 이동 영구 삭제 완료!
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: 'power2.inOut' },
      });
      tlRef.current = tl;

      tl.addLabel('step0')
        .to('.home-panel', { yPercent: -100 }, 'step1')
        .to('.project-panel', { yPercent: 0 }, 'step1')
        .to('.ground', { yPercent: 0 }, 'step1')
        .to('.duck-container', { scale: 0.4, x: '-35vw', y: '20vh' }, 'step1')
        .addLabel('step1')

        // 프로젝트 -> 컨택트 (이제 오리는 가만히 있습니다!)
        .to('.project-panel', { xPercent: -100 }, 'step2')
        .to('.contact-panel', { xPercent: 0 }, 'step2')
        .addLabel('step2');

      const goToSection = (newIndex) => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        currentIndexRef.current = newIndex;
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

      // ⭐️ 2. 마우스와 모바일 터치 방향 독립 제어 (방향 반전 해결!)
      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 10,
        preventDefault: true,
        onChangeY: (self) => {
          if (isAnimatingRef.current) return;

          let isScrollingDown;
          // 터치(모바일)인지 휠(데스크톱)인지 검사해서 방향을 다르게 적용합니다
          if (
            self.event.type.includes('touch') ||
            self.event.type.includes('pointer')
          ) {
            isScrollingDown = self.deltaY < 0; // 모바일: 정방향 (손가락을 위로 올리면 다음 화면)
          } else {
            isScrollingDown = self.deltaY > 0; // 데스크톱: 예환님 마우스에 맞춘 역방향
          }

          if (isScrollingDown && currentIndexRef.current < 2) {
            goToSection(currentIndexRef.current + 1);
          } else if (!isScrollingDown && currentIndexRef.current > 0) {
            goToSection(currentIndexRef.current - 1);
          }
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
      {/* ⭐️ 1. 하늘과 해, 구름 배경 */}
      <div className="sky">
        {isDay && (
          <img
            src={`${import.meta.env.BASE_URL}assets/Sun.png`}
            alt="Sun"
            className="sun"
            style={sunStyle}
          />
        )}
        <img
          src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
          alt="Cloud"
          className="cloud cloud1"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
          alt="Cloud"
          className="cloud cloud2"
        />
      </div>

      <Duck />

      {/* ⭐️ 2. 땅과 자연물 오브젝트 */}
      <div className="ground">
        {/* 친구분이 그려주신 에셋을 땅 위에 배치합니다 */}
        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          alt="Tree"
          className="deco tree"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/grass_1.png`}
          alt="Grass"
          className="deco grass1"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/grass_2.png`}
          alt="Grass"
          className="deco grass2"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          alt="Rock"
          className="deco rock"
        />
      </div>

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
