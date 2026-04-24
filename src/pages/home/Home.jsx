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

// ⭐️ 리액트가 렌더링할 때마다 스타일을 덮어씌우는 걸 막기 위해 아예 밖에다 빼둔 고정 스타일
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

  // ⭐️ 리액트 방어 1: 기기가 바뀌지 않는 한 설정값을 재생성하지 않음 (GSAP 속성 보호)
  const STAGE_CONFIG = useMemo(() => getStageConfig(deviceType), [deviceType]);

  // ⭐️ 리액트 방어 2: 태양 위치도 처음 한 번만 계산해서 영구 고정 (화면 깜빡임 원천 차단)
  const [timeData] = useState(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 19;
    const progress = isDay ? (hour - 6) / 13 : 0;
    return {
      isDay,
      sunStyle: isDay
        ? {
            left: `${80 - progress * 70}vw`,
            top: `${40 - Math.sin(progress * Math.PI) * 30}vh`,
          }
        : {},
    };
  });

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
      x: '10vw',
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
      x: '10vw',
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
      const getPos = (el, isOut, targetSection) => {
        const isDuck = el.classList.contains('duck-container');
        const dir = el.dataset.outDir || 'bottom';
        let inX = isDuck
          ? STAGE_CONFIG.duck.positions[`sec${targetSection}`]?.x || '0vw'
          : '0vw';
        let inY = isDuck
          ? STAGE_CONFIG.duck.positions[`sec${targetSection}`]?.y || '0vh'
          : '0vh';

        if (targetSection === 0 && !isDuck) isOut = true;

        if (isOut) {
          // ⭐️ 대각선 차단 1: 숨길 때는 X좌표를 절대 바꾸지 않고 오로지 Y(수직)로만 올리거나 내립니다!
          return { x: inX, y: dir === 'top' ? '-250vh' : '250vh' };
        }
        return { x: inX, y: inY };
      };

      gsap.set('.project-panel, .contact-panel', { opacity: 0, autoAlpha: 0 });
      gsap.set('.sky-bg', { autoAlpha: 0 });
      gsap.set('.ground-bg', { y: '100%' });

      // 처음 시작 시 완벽 세팅
      gsap.utils.toArray('.puppet').forEach((el) => {
        const isDuck = el.classList.contains('duck-container');
        const pos = getPos(el, false, 0);
        if (isDuck) {
          gsap.set(el, {
            x: pos.x,
            y: pos.y,
            scaleX: STAGE_CONFIG.duck.positions.sec0.scale,
            scaleY: STAGE_CONFIG.duck.positions.sec0.scale,
            opacity: 1,
          });
        } else {
          gsap.set(el, { x: pos.x, y: pos.y, opacity: 1 });
        }
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

          // ⭐️ 대각선 차단 2: 나갈 때는 X 건드리지 말고 Y로만 "일직선"으로 떨어져라!
          tl.to(
            '.puppet',
            {
              y: (i, el) => getPos(el, true, oldIndex).y,
              duration: 0.8,
              stagger: 0.05,
              ease: 'back.in(1.2)',
            },
            0
          ).to('.panel', { autoAlpha: 0, duration: 0.3 }, 0);

          const enterTime = 0.8;

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

          // ⭐️ 대각선 차단 3: 화면 밖 바닥 밑에 숨어있을 때, 몰래 새로운 X 좌표로 "순간이동" 시킨다!
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
              '.puppet',
              {
                x: (i, el) => getPos(el, false, newIndex).x, // 몰래 x 이동!
                y: (i, el) => getPos(el, true, newIndex).y, // 여전히 바닥(y)에 숨어있음
              },
              enterTime
            )
            .set(
              '.duck-container',
              { scaleX: duckPos.scale, scaleY: duckPos.scale },
              enterTime
            )
            .set('.ground', { x: newIndex === 2 ? STAGE_CONFIG.groundOffset : '0vw' }, enterTime)

          // ⭐️ 대각선 차단 4: 등장할 때는 X 건드리지 말고 Y로만 "일직선"으로 올라와라!
          // 단, 메인 화면(0번)으로 올 때는 '오리'만 올라오고 다른 애들은 바닥에 가만히 숨어있어라!
          const enterTargets = newIndex === 0 ? '.duck-container' : '.puppet';
          tl.to(
            enterTargets,
            {
              y: (i, el) => getPos(el, false, newIndex).y,
              duration: 1,
              stagger: 0.05,
              ease: 'elastic.out(1, 0.5)',
            },
            enterTime
          );
        } else {
          // 걷기 (카메라 패닝)
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
          <img
            src={`${import.meta.env.BASE_URL}assets/Sun.png`}
            alt="Sun"
            className="sun puppet"
            style={timeData.sunStyle}
            data-out-dir={STAGE_CONFIG.sky.sun.outDir}
          />
        )}
        <div
          className="cloud-wrapper puppet"
          data-out-dir={STAGE_CONFIG.sky.cloud1.outDir}
          style={CLOUD_WRAPPER_STYLE}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud1"
          />
        </div>
        <div
          className="cloud-wrapper puppet"
          data-out-dir={STAGE_CONFIG.sky.cloud2.outDir}
          style={CLOUD_WRAPPER_STYLE}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud2"
          />
        </div>
      </div>

      <div
        className="duck-container puppet"
        data-out-dir={STAGE_CONFIG.duck.outDir}
      >
        <Duck />
      </div>

      <div className="ground">
        <div className="ground-bg"></div>
        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.tree}
          data-out-dir={STAGE_CONFIG.sec1.tree.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_1.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.grass1}
          data-out-dir={STAGE_CONFIG.sec1.grass1.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_2.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.grass1_sub}
          data-out-dir={STAGE_CONFIG.sec1.grass1_sub.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec1.rock}
          data-out-dir={STAGE_CONFIG.sec1.rock.outDir}
          alt=""
        />

        <div
          className="deco puppet windmill-placeholder"
          style={{
            ...STAGE_CONFIG.sec1.windmill,
            backgroundColor: 'rgba(255,100,100,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          data-out-dir={STAGE_CONFIG.sec1.windmill.outDir}
          onClick={handleWindmillClick}
        >
          <h2>⚙️ 풍차</h2>
        </div>

        <img
          src={`${import.meta.env.BASE_URL}assets/Tree.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.tree}
          data-out-dir={STAGE_CONFIG.sec2.tree.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_2.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.grass2}
          data-out-dir={STAGE_CONFIG.sec2.grass2.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Grass_1.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.grass2_sub}
          data-out-dir={STAGE_CONFIG.sec2.grass2_sub.outDir}
          alt=""
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/Rock.png`}
          className="deco puppet"
          style={STAGE_CONFIG.sec2.rock}
          data-out-dir={STAGE_CONFIG.sec2.rock.outDir}
          alt=""
        />

        <div
          className="deco puppet mailbox-placeholder"
          style={{
            ...STAGE_CONFIG.sec2.mailbox,
            backgroundColor: 'rgba(100,100,255,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          data-out-dir={STAGE_CONFIG.sec2.mailbox.outDir}
          onClick={handleMailboxClick}
        >
          <h2>📬 우편함</h2>
        </div>
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
