import React, {
  useLayoutEffect,
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './duck/Duck.jsx';
import './Home.css';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { getStageConfig } from './stageConfig';

gsap.registerPlugin(Observer);

// ⭐️ GSAP 조종용 부모 껍데기 스타일
const CLOUD_WRAPPER_STYLE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

export default function Home() {
  const homeRef = useRef();
  const navigate = useNavigate();
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [shouldPlayIris] = useState(
    () => sessionStorage.getItem('playIris') === 'true'
  );

  const getDeviceType = () => {
    if (window.innerWidth <= 768) return 'mobile';
    if (window.innerWidth <= 1024) return 'tablet';
    return 'pc';
  };
  const [deviceType, setDeviceType] = useState(getDeviceType());

  // ⭐️ 리액트 방어 1: 기기가 바뀌지 않는 한 설정값을 재생성하지 않음
  const STAGE_CONFIG = useMemo(() => getStageConfig(deviceType), [deviceType]);

  // ⭐️ 수정된 부분: 태양 궤도를 조종실(STAGE_CONFIG)에서 가져와서 계산!
  const timeData = useMemo(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 19;
    const progress = isDay ? (hour - 6) / 13 : 0;

    // 조종실에서 값 가져오기 (만약 값이 없으면 기본값 40, 30 사용)
    const baseY = STAGE_CONFIG.sky.sun.baseY || 40;
    const amplitude = STAGE_CONFIG.sky.sun.amplitude || 30;

    return {
      isDay,
      sunStyle: isDay
        ? {
            left: `${80 - progress * 70}vw`,
            // ⭐️ 수학 공식 안에 조종실 값(baseY, amplitude) 투입!
            top: `${baseY - Math.sin(progress * Math.PI) * amplitude}vh`,
          }
        : {},
    };
  }, [STAGE_CONFIG]); // 조종실 설정이 바뀌면 태양 위치도 즉시 재계산!

  useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history)
      window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-section', '0');
    return () => (document.body.style.overflow = 'auto');
  }, []);

  useEffect(() => {
    if (isMailboxOpen)
      gsap.fromTo(
        '.contact-card',
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );
  }, [isMailboxOpen]);

  const handleWindmillClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    gsap.to('.duck-container', {
      x: STAGE_CONFIG.sec1.windmill.walkToX || '10vw',
      duration: 2.5,
      ease: 'power1.inOut',
      onComplete: () => {
        sessionStorage.setItem('playIris', 'true');
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
          onComplete: () => navigate('/projects/Projects'),
        });
      },
    });
  };

  const handleMailboxClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    gsap.to('.duck-container', {
      x: STAGE_CONFIG.sec2.mailbox.walkToX || '10vw',
      duration: 2.5,
      ease: 'power1.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsMailboxOpen(true);
      },
    });
  };

  const handleHeaderProjectsClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    sessionStorage.setItem('playIris', 'true');
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
      onComplete: () => navigate('/projects/Projects'),
    });
  };

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

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // ==========================================
      // ⭐️ 1. 초기 세팅: 메인(섹션 1)에서는 오리만 빼고 다 숨김!
      // ==========================================
      gsap.set('.project-panel, .contact-panel', { opacity: 0, autoAlpha: 0 });
      gsap.set('.sky-bg', { autoAlpha: 0 });
      gsap.set('.ground-bg', { y: '100%' });

      // 하늘(해, 구름)은 하늘 위(-150vh)에 대기
      gsap.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh', opacity: 1 });
      // 땅 에셋(나무, 풍차 등)은 땅 밑(150vh)에 대기
      gsap.set('.deco', { y: '150vh', opacity: 1 });

      // 오리만 메인 화면 정위치에 세팅
      gsap.set('.duck-container', {
        x: STAGE_CONFIG.duck.positions.sec0.x,
        y: STAGE_CONFIG.duck.positions.sec0.y,
        scaleX: STAGE_CONFIG.duck.positions.sec0.scale,
        scaleY: STAGE_CONFIG.duck.positions.sec0.scale,
        opacity: 1,
      });

      const goToSection = (newIndex, isMenu = false, openContact = false) => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        const oldIndex = currentIndexRef.current;
        currentIndexRef.current = newIndex;

        document.body.setAttribute('data-section', newIndex);
        setIsMailboxOpen(false);

        const duckPos = STAGE_CONFIG.duck.positions[`sec${newIndex}`];
        const isMovingRight = newIndex > oldIndex;
        const targetScaleX = isMovingRight ? duckPos.scale : -duckPos.scale;

        if (
          isMenu ||
          (oldIndex === 0 && newIndex === 1) ||
          (oldIndex === 1 && newIndex === 0)
        ) {
          const tl = gsap.timeline({
            onComplete: () => {
              isAnimatingRef.current = false;
              if (openContact) setIsMailboxOpen(true);
            },
          });

          // ==========================================
          // ⭐️ 2. 퇴장 모션: 무조건 전부 화면 밖으로 치워버림
          // ==========================================
          tl.to(
            '.duck-container, .deco',
            { y: '150vh', duration: 0.8, stagger: 0.05, ease: 'back.in(1.2)' },
            0
          );
          tl.to(
            '.sun-wrapper, .cloud-wrapper',
            { y: '-150vh', duration: 0.8, ease: 'back.in(1.2)' },
            0
          );
          tl.to('.panel', { autoAlpha: 0, duration: 0.3 }, 0);

          const enterTime = 1.5; // 모든 에셋이 완전히 퇴장할 때까지 기다리는 시간

          // 배경 전환
          if (newIndex === 0) {
            tl.to('.sky-bg', { autoAlpha: 0, duration: 0.8 }, enterTime).to(
              '.ground-bg',
              { y: '100%', duration: 0.8, ease: 'power2.in' },
              enterTime
            );
          } else {
            tl.to('.sky-bg', { autoAlpha: 1, duration: 1 }, enterTime).to(
              '.ground-bg',
              { y: '0%', duration: 1, ease: 'power2.out' },
              enterTime
            );
          }

          // 패널, 카메라 이동 세팅
          tl.set(`.panel`, { autoAlpha: 0 }, enterTime)
            .set(
              newIndex === 0
                ? '.home-panel'
                : newIndex === 1
                ? '.project-panel'
                : '.contact-panel',
              { autoAlpha: 1 },
              enterTime
            )
            .set(
              '.ground',
              { x: newIndex === 2 ? STAGE_CONFIG.groundOffset : '0vw' },
              enterTime
            );

          // ==========================================
          // ⭐️ 3. 등장 모션: 어디로 가느냐에 따라 갈림
          // ==========================================
          if (newIndex === 0) {
            // [섹션 1 (메인 홈)으로 올 때]
            tl.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh' }, enterTime); // 하늘 숨김 유지
            tl.set('.deco', { y: '150vh' }, enterTime); // 땅 에셋 숨김 유지

            // 오리만 밑에서 띠용! 하고 혼자 올라옴
            tl.set(
              '.duck-container',
              {
                x: STAGE_CONFIG.duck.positions.sec0.x,
                y: '150vh',
                scaleX: STAGE_CONFIG.duck.positions.sec0.scale,
                scaleY: STAGE_CONFIG.duck.positions.sec0.scale,
              },
              enterTime
            );
            tl.to(
              '.duck-container',
              {
                y: STAGE_CONFIG.duck.positions.sec0.y,
                duration: 1,
                ease: 'elastic.out(1, 0.5)',
              },
              enterTime
            );
          } else {
            // [섹션 2, 3 (풍차, 우편함)으로 갈 때]
            // 하늘(해, 구름)이 위에서 띠용! 내려옴
            tl.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh' }, enterTime);
            tl.to(
              '.sun-wrapper, .cloud-wrapper',
              { y: '0vh', duration: 1, ease: 'elastic.out(1, 0.5)' },
              enterTime
            );

            // 땅 에셋(나무, 풍차 등)이 밑에서 띠용! 올라옴
            tl.set('.deco', { y: '150vh' }, enterTime);
            tl.to(
              '.deco',
              {
                y: '0vh',
                duration: 1,
                stagger: 0.05,
                ease: 'elastic.out(1, 0.5)',
              },
              enterTime
            );

            // 오리는 화면 왼쪽 밖에서 터벅터벅 걸어 들어옴!
            tl.set(
              '.duck-container',
              {
                x: '-100vw',
                y: duckPos.y,
                scaleX: duckPos.scale,
                scaleY: duckPos.scale,
              },
              enterTime
            );
            tl.to(
              '.duck-container',
              { x: duckPos.x, duration: 2.5, ease: 'power2.out' },
              enterTime
            );
          }
        } else {
          // 걷기 (섹션 2 ↔ 3 이동 시에는 하늘은 어차피 보여져 있으므로 냅둠)
          const tl = gsap.timeline({
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          });
          const xMove = newIndex === 2 ? STAGE_CONFIG.groundOffset : '0vw';

          tl.to('.duck-container', {
            scaleX: targetScaleX,
            scaleY: duckPos.scale,
          })
            .to(
              '.ground',
              { x: xMove, duration: 2, ease: 'power2.inOut' },
              'walk'
            )
            .to(
              '.duck-container',
              { x: duckPos.x, y: duckPos.y, duration: 2, ease: 'power2.inOut' },
              'walk'
            )
            .to('.duck-container', {
              scaleX: duckPos.scale,
              duration: 0.3,
              ease: 'power1.inOut',
            });

          gsap.to(oldIndex === 1 ? '.project-panel' : '.contact-panel', {
            autoAlpha: 0,
            duration: 0.5,
          });
          gsap.to(newIndex === 1 ? '.project-panel' : '.contact-panel', {
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.5,
          });
        }
      };

      if (sessionStorage.getItem('goToContact') === 'true') {
        sessionStorage.removeItem('goToContact');
        setTimeout(() => goToSection(2, true, true), 100);
      }
      if (sessionStorage.getItem('goToWindmill') === 'true') {
        sessionStorage.removeItem('goToWindmill');
        setTimeout(() => goToSection(1, true, false), 100);
      }

      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 20,
        preventDefault: false,
        onChangeY: (self) => {
          if (isAnimatingRef.current) return;
          if (self.deltaY > 0 && currentIndexRef.current < 2)
            goToSection(currentIndexRef.current + 1);
          else if (self.deltaY < 0 && currentIndexRef.current > 0)
            goToSection(currentIndexRef.current - 1);
        },
      });

      const handleNavSignal = (e) => {
        const target = e.detail;
        if (target === 1) handleHeaderProjectsClick();
        else if (currentIndexRef.current !== target)
          goToSection(target, true, target === 2);
        else if (target === 2) setIsMailboxOpen(true);
      };

      window.addEventListener('navToSection', handleNavSignal);
      return () => window.removeEventListener('navToSection', handleNavSignal);
    }, homeRef);
    return () => ctx.revert();
  }, [navigate, STAGE_CONFIG]);

  return (
    <div className="home-container" ref={homeRef}>
      <div className="sky">
        <div className="sky-bg"></div>

        {timeData.isDay && (
          <div className="sun-wrapper puppet" style={CLOUD_WRAPPER_STYLE}>
            <img
              src={`${import.meta.env.BASE_URL}assets/Sun.png`}
              alt="Sun"
              className="sun"
              // ⭐️ 시간에 따른 위치(timeData.sunStyle) + 설정파일의 크기(STAGE_CONFIG.sky.sun) 결합!
              style={{ ...timeData.sunStyle, ...STAGE_CONFIG.sky.sun }}
            />
          </div>
        )}

        <div className="cloud-wrapper puppet" style={CLOUD_WRAPPER_STYLE}>
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud1"
            style={STAGE_CONFIG.sky.cloud1} // ⭐️ 조종실 연결!
          />
        </div>
        <div className="cloud-wrapper puppet" style={CLOUD_WRAPPER_STYLE}>
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud2"
            style={STAGE_CONFIG.sky.cloud2} // ⭐️ 조종실 연결!
          />
        </div>
      </div>

      <div className="duck-container puppet">
        <Duck />
      </div>

      <div className="ground">
        <div className="ground-bg"></div>
        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.tree}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_1.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.grass1}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_2.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.grass1_sub}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.rock}
          alt=""
        />

        <div
          className="deco puppet"
          style={{ ...STAGE_CONFIG.sec1.windmill, cursor: 'pointer' }}
          onClick={handleWindmillClick}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/Windmill_body.png`}
            alt="Windmill Body"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/Windmill_wing.png`}
            alt="Windmill Wing"
            className="windmill-wing"
          />
        </div>

        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.tree}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_2.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.grass2}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_1.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.grass2_sub}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.rock}
          alt=""
        />

        <img
          src={`${import.meta.env.BASE_URL}assets/Mailbox.png`}
          alt="Mailbox"
          className="deco puppet"
          style={{
            ...STAGE_CONFIG.sec2.mailbox,
            objectFit: 'contain',
            cursor: 'pointer',
          }}
          onClick={handleMailboxClick}
        />
      </div>

      <div className="panels-container">
        <section className="panel home-panel" style={{ opacity: 1 }}>
          <div className="home-content" style={STAGE_CONFIG.homeText}>
            <h1 className="creator-name">나의 이름</h1>
            <p className="creator-desc">
              간략한 설명 (예: 프론트엔드 개발자 포트폴리오)
            </p>
          </div>
        </section>
        <section className="panel project-panel"></section>
        <section
          className="panel contact-panel"
          style={{ pointerEvents: 'none' }}
        >
          {isMailboxOpen && (
            <div
              className="contact-card"
              style={{
                ...contactStyles.card,
                pointerEvents: 'auto',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setIsMailboxOpen(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                }}
              >
                ❌
              </button>
              <h2>Contact Me</h2>
              <form style={contactStyles.form}>
                <input
                  type="text"
                  placeholder="성함"
                  style={contactStyles.input}
                />
                <input
                  type="email"
                  placeholder="이메일"
                  style={contactStyles.input}
                />
                <textarea
                  placeholder="메시지"
                  style={contactStyles.textarea}
                ></textarea>
                <button type="button" style={contactStyles.button}>
                  보내기
                </button>
              </form>
            </div>
          )}
        </section>
      </div>

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
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px' },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    height: '80px',
    resize: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
