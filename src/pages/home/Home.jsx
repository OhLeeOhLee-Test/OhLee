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
      // ⭐️ 1. 초기 상태 세팅
      gsap.set('.project-panel', { yPercent: 100 });
      gsap.set('.contact-panel', { xPercent: 100 });
      // 1. 초기 상태 세팅
      gsap.set('.duck-container', {
        scale: 2.2, // 🔍 줌인 비율 (숫자가 클수록 얼굴이 더 커집니다)
        x: '0vw', // ↔️ 좌우 이동 (오리가 왼쪽에 치우쳤다면 "5vw"나 "20px"로 밀어보세요)
        y: '0vh', // ↕️ 상하 이동 (오리 얼굴이 너무 위에 있다면 "10vh" ~ "20vh"로 내려보세요)
        transformOrigin: '50% 30%', // 📌 줌인의 기준점! (오리 얼굴이 보통 위쪽에 있으니 "50% 30%" 정도로 주면 얼굴을 중심으로 줌아웃됩니다)
      });
      gsap.set('.ground', {
        scale: 3,
        transformOrigin: '15% bottom',
        y: '50vh',
      });
      gsap.set('.sky', { scale: 1.2, transformOrigin: '15% bottom' });

      // ⭐️ 추가: 처음에는 나무, 풀, 돌을 투명하게 숨겨서 오리에게만 집중시킵니다!
      gsap.set('.deco', { opacity: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1.2, ease: 'power2.inOut' },
      });
      tlRef.current = tl;

      tl.addLabel('step0')
        .to('.home-panel', { yPercent: -100 }, 'step1')
        .to('.project-panel', { yPercent: 0 }, 'step1')
        .to('.sky', { scale: 1 }, 'step1')
        .to('.ground', { scale: 1, y: 0 }, 'step1')
        .to('.deco', { opacity: 1, duration: 1.0 }, 'step1')

        // ⭐️ 여기서 광각 렌즈 모드일 때의 오리 위치를 잡습니다!
        .to(
          '.duck-container',
          {
            scale: 0.4, // 🔍 줌아웃 후 오리의 최종 크기
            x: '-35vw', // ↔️ 땅의 왼쪽 편에 서 있게 할 위치
            y: '30vh', // ↕️ 땅(Ground)의 높이와 발이 딱 맞게 닿는 위치
          },
          'step1'
        )
        .addLabel('step1')

        // 2단계: 프로젝트 -> 컨택트
        .to('.project-panel', { xPercent: -100, duration: 3 }, 'step2')
        .to('.contact-panel', { xPercent: 0, duration: 3 }, 'step2')
        .to('.ground', { xPercent: -50, duration: 3 }, 'step2')
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

      // ⭐️ 4. 마우스/터치 감지기 (모바일 스와이프와 PC 휠 완벽 분리!)
      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 20,
        preventDefault: true,

        // 📱 [모바일 전용] 스와이프 동작
        onUp: (self) => {
          if (self.event.type === 'wheel') return; // PC 휠은 여기서 작동 안 함!
          if (!isAnimatingRef.current && currentIndexRef.current === 0)
            goToSection(1);
        },
        onDown: (self) => {
          if (self.event.type === 'wheel') return;
          if (!isAnimatingRef.current && currentIndexRef.current === 1)
            goToSection(0);
        },
        onLeft: (self) => {
          if (self.event.type === 'wheel') return;
          if (!isAnimatingRef.current && currentIndexRef.current === 1)
            goToSection(2);
        },
        onRight: (self) => {
          if (self.event.type === 'wheel') return;
          if (!isAnimatingRef.current && currentIndexRef.current === 2)
            goToSection(1);
        },

        // 💻 [PC 전용] 마우스 휠 동작
        onChangeY: (self) => {
          if (self.event.type !== 'wheel') return; // 모바일 터치는 무시!
          if (isAnimatingRef.current) return;

          // ⭐️ PC 휠을 몸쪽으로 내릴 때 (정방향) 다음 섹션으로 갑니다.
          // 혹시라도 예환님 마우스 세팅 때문에 여전히 반대라면 > 를 < 로만 바꿔주세요!
          let isScrollingDown = self.deltaY > 0;

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

      <div className="ground">
        {/* 섹션 2에서 보이는 자연물들 */}
        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco tree1"
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/grass_1.png`}
          className="deco grass1"
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco rock1"
          alt=""
        />

        {/* ⭐️ 섹션 3(오른쪽 땅)에서 보일 자연물들 추가! */}
        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco tree2"
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/grass_2.png`}
          className="deco grass2"
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco rock2"
          alt=""
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
