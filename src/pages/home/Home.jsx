import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './duck/Duck.jsx';
import './Home.css';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

const STAGE_CONFIG = {
  duck: {
    outDir: 'bottom',
    positions: {
      sec0: { x: '25vw', y: '15vh', scale: 1 },
      sec1: { x: '-35vw', y: '30vh', scale: 0.4 },
      sec2: { x: '-35vw', y: '30vh', scale: 0.4 },
    },
  },
  sky: {
    sun: { outDir: 'top' },
    cloud1: { outDir: 'top' },
    cloud2: { outDir: 'top' },
  },
  sec1: {
    tree: { left: '5%', bottom: '-3vw', width: '20vw', outDir: 'bottom' },
    grass1: { left: '20%', bottom: '-0.5vw', width: '10vw', outDir: 'left' },
    grass1_sub: {
      left: '28%',
      bottom: '-20vw',
      width: '10vw',
      outDir: 'bottom',
    },
    rock: { left: '38%', bottom: '-1vw', width: '10vw', outDir: 'bottom' },
    windmill: {
      left: '45vw',
      bottom: '10vh',
      width: '250px',
      zIndex: 10,
      outDir: 'bottom',
    },
  },
  sec2: {
    tree: { left: '60%', bottom: '-0.5vw', width: '20vw', outDir: 'bottom' },
    grass2: { left: '75%', bottom: '-25vw', width: '10vw', outDir: 'bottom' },
    grass2_sub: {
      left: '85%',
      bottom: '-0.5vw',
      width: '10vw',
      outDir: 'bottom',
    },
    rock: { left: '92%', bottom: '-1vw', width: '10vw', outDir: 'bottom' },
    mailbox: {
      left: '85vw',
      bottom: '10vh',
      width: '150px',
      zIndex: 10,
      outDir: 'bottom',
    },
  },
};

export default function Home() {
  const homeRef = useRef();
  const navigate = useNavigate();
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const [sunStyle, setSunStyle] = useState({});
  const [isDay, setIsDay] = useState(true);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);

  // ⭐️ 1. 티켓 유무를 화면 렌더링 전(초기 상태)에 확인합니다! (번쩍임 방지)
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
        width: '300vmax', // 넉넉하게 키움
        height: '300vmax',
        duration: 1.5, // 딜레이 없이 1.5초로 산뜻하게!
        ease: 'power2.inOut',
        onComplete: () => gsap.set('.iris-overlay', { display: 'none' }),
      });
    }
  }, [shouldPlayIris]);

  useEffect(() => {
    if (isMailboxOpen) {
      gsap.fromTo(
        '.contact-card',
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, [isMailboxOpen]);

  useEffect(() => {
    const updateSun = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 19) {
        setIsDay(true);
        const progress = (hour - 6) / 13;
        setSunStyle({
          left: `${80 - progress * 70}vw`,
          top: `${40 - Math.sin(progress * Math.PI) * 30}vh`,
        });
      } else {
        setIsDay(false);
      }
    };
    updateSun();
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history)
      window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-section', '0');
    return () => (document.body.style.overflow = 'auto');
  }, []);

  const handleWindmillClick = () => {
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
      onComplete: () => {
        isAnimatingRef.current = false;
        navigate('/projects/Projects');
      },
    });
  };

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
          if (dir === 'left') return { x: '-250vw', y: inY };
          if (dir === 'right') return { x: '250vw', y: inY };
          if (dir === 'top') return { x: inX, y: '-250vh' };
          if (dir === 'bottom') return { x: inX, y: '250vh' };
        }
        return { x: inX, y: inY };
      };

      gsap.set('.project-panel, .contact-panel', { opacity: 0, autoAlpha: 0 });
      const initDuck = STAGE_CONFIG.duck.positions.sec0;
      gsap.set('.duck-container', {
        x: initDuck.x,
        y: initDuck.y,
        scaleX: initDuck.scale,
        scaleY: initDuck.scale,
        opacity: 1,
      });

      gsap.utils.toArray('.puppet:not(.duck-container)').forEach((el) => {
        const pos = getPos(el, true, 0);
        gsap.set(el, { x: pos.x, y: pos.y, opacity: 1 });
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

          tl.to(
            '.puppet',
            {
              x: (i, el) => getPos(el, true, oldIndex).x,
              y: (i, el) => getPos(el, true, oldIndex).y,
              duration: 0.8,
              stagger: 0.05,
              ease: 'back.in(1.2)',
            },
            '+=0.1'
          )
            .to('.panel', { autoAlpha: 0, duration: 0.3 }, '<')
            .set(`.panel`, { autoAlpha: 0 })
            .set(
              newIndex === 0
                ? '.home-panel'
                : newIndex === 1
                ? '.project-panel'
                : '.contact-panel',
              { autoAlpha: 1 }
            )
            .set('.puppet', {
              x: (i, el) => getPos(el, true, newIndex).x,
              y: (i, el) => getPos(el, true, newIndex).y,
            })
            .set('.duck-container', {
              scaleX: duckPos.scale,
              scaleY: duckPos.scale,
            })
            .set('.ground', { x: newIndex === 2 ? '-50vw' : '0vw' })
            .to('.puppet', {
              x: (i, el) => getPos(el, false, newIndex).x,
              y: (i, el) => getPos(el, false, newIndex).y,
              duration: 1,
              stagger: 0.05,
              ease: 'elastic.out(1, 0.5)',
            });
        } else {
          const tl = gsap.timeline({
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          });
          const xMove = newIndex === 2 ? '-50vw' : '0vw';

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

      // ⭐️ 2. 프로젝트에서 헤더 메뉴를 통해 돌아온 경우 (오류 해결 핵심!)
      if (sessionStorage.getItem('goToContact') === 'true') {
        sessionStorage.removeItem('goToContact');
        // 컴포넌트 렌더링 충돌을 막기 위해 0.1초 뒤에 애니메이션 실행
        setTimeout(() => {
          goToSection(2, true, true);
        }, 100);
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
        if (target === 1) handleWindmillClick();
        else if (currentIndexRef.current !== target)
          goToSection(target, true, target === 2);
        else if (target === 2) setIsMailboxOpen(true);
      };

      window.addEventListener('navToSection', handleNavSignal);
      return () => window.removeEventListener('navToSection', handleNavSignal);
    }, homeRef);
    return () => ctx.revert();
  }, [navigate]);

  return (
    <div className="home-container" ref={homeRef}>
      <div className="sky">
        {isDay && (
          <img
            src={`${import.meta.env.BASE_URL}assets/Sun.png`}
            alt="Sun"
            className="sun puppet"
            style={sunStyle}
            data-out-dir={STAGE_CONFIG.sky.sun.outDir}
          />
        )}
        <div
          className="cloud-wrapper puppet"
          data-out-dir={STAGE_CONFIG.sky.cloud1.outDir}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
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
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
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
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
          data-out-dir={STAGE_CONFIG.sec2.mailbox.outDir}
          onClick={() => setIsMailboxOpen(true)}
        >
          <h2>📬 우편함</h2>
        </div>
      </div>

      <div className="panels-container">
        <section className="panel home-panel" style={{ opacity: 1 }}>
          <div className="home-content">
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

      {/* ⭐️ 가장 중요: 티켓이 있으면 처음부터 0px로 막고, 없으면 안 보이게 처리! */}
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
