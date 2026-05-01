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

  const STAGE_CONFIG = useMemo(() => getStageConfig(deviceType), [deviceType]);

  const [timeData] = useState(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 19;
    const progress = isDay ? (hour - 6) / 13 : 0;

    const baseY = STAGE_CONFIG.sky.sun.baseY || 40;
    const amplitude = STAGE_CONFIG.sky.sun.amplitude || 30;

    return {
      isDay,
      sunStyle: isDay
        ? {
            left: `${80 - progress * 70}vw`,
            top: `${baseY - Math.sin(progress * Math.PI) * amplitude}vh`,
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

  // ==========================================
  // ⭐️ 1. 완벽 동기화 걷기 엔진 (가상의 그림자 로직)
  // ==========================================
  const playSyncWalk = (duration, easeCurve, steps = 16) => {
    const proxy = { p: 0 };
    gsap.killTweensOf('.duck-sprite', 'y');

    gsap.to(proxy, {
      p: 1,
      duration: duration,
      ease: easeCurve,
      onUpdate: () => {
        // ⭐️ 진폭(점프 높이) 조절: 맨 끝의 '-15' 숫자를 0에 가깝게(-10, -5 등) 줄이면 얌전해집니다!
        const bounce = Math.abs(Math.sin(proxy.p * Math.PI * steps)) * -15;
        gsap.set('.duck-sprite', { y: bounce });
      },
      onComplete: () => gsap.set('.duck-sprite', { y: 0 }),
    });
  };

  // ==========================================
  // ⭐️ 2. 지능형 아이리스(Iris) 효과 트랜지션
  // ==========================================
  const triggerIrisTransition = (isEntering, onCompleteCallback) => {
    const duckImg = document.querySelector('.duck-image');
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (duckImg) {
      const rect = duckImg.getBoundingClientRect();
      if (rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }
    }

    const startSize = isEntering ? '0px' : '300vmax';
    const endSize = isEntering ? '300vmax' : '0px';

    gsap.fromTo(
      '.iris-overlay',
      {
        display: 'block',
        position: 'fixed',
        left: originX,
        top: originY,
        xPercent: -50,
        yPercent: -50,
        width: startSize,
        height: startSize,
        borderRadius: '50%',
        boxShadow: '0 0 0 300vmax #000',
        backgroundColor: 'transparent',
        zIndex: 9999,
      },
      {
        width: endSize,
        height: endSize,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          if (isEntering) gsap.set('.iris-overlay', { display: 'none' });
          if (onCompleteCallback) onCompleteCallback();
        },
      }
    );
  };

  const handleWindmillClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // ⭐️ 진동수 조절 1: 풍차로 걸어갈 때의 걸음수 (기본 16보)
    playSyncWalk(2.5, 'power1.inOut', 8);
    gsap.to('.duck-container', {
      left: STAGE_CONFIG.sec1.windmill.walkToLeft || '10vw',
      duration: 2.5,
      ease: 'power1.inOut',
      onComplete: () => {
        sessionStorage.setItem('playIris', 'true');
        triggerIrisTransition(false, () => navigate('/projects/Projects'));
      },
    });
  };

  const handleMailboxClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // ⭐️ 진동수 조절 2: 우편함으로 걸어갈 때의 걸음수 (기본 16보)
    playSyncWalk(2.5, 'power1.inOut', 8);
    gsap.to('.duck-container', {
      left: STAGE_CONFIG.sec2.mailbox.walkToLeft || '10vw',
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
    triggerIrisTransition(false, () => navigate('/projects/Projects'));
  };

  useLayoutEffect(() => {
    if (shouldPlayIris) {
      sessionStorage.removeItem('playIris');
      setTimeout(() => {
        triggerIrisTransition(true);
      }, 100);
    }
  }, [shouldPlayIris]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set('.project-panel, .contact-panel', { opacity: 0, autoAlpha: 0 });
      gsap.set('.sky-bg', { autoAlpha: 0 });
      gsap.set('.ground-bg', { y: '100%' });
      gsap.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh', opacity: 1 });
      gsap.set('.deco', { y: '150vh', opacity: 1 });

      // ⭐️ 오리의 위치를 창 크기가 변해도 끄떡없는 left, bottom으로 세팅!
      gsap.set('.duck-container', {
        top: 'auto',
        left: STAGE_CONFIG.duck.positions.sec0.left,
        bottom: STAGE_CONFIG.duck.positions.sec0.bottom,
        scaleX: STAGE_CONFIG.duck.positions.sec0.scale,
        scaleY: STAGE_CONFIG.duck.positions.sec0.scale,
        transformOrigin: 'bottom center',
        opacity: 1,
        x: 0,
        y: 0,
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

          const enterTime = 1.5;

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

          if (newIndex === 0) {
            tl.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh' }, enterTime);
            tl.set('.deco', { y: '150vh' }, enterTime);

            tl.set(
              '.duck-container',
              {
                left: STAGE_CONFIG.duck.positions.sec0.left,
                bottom: STAGE_CONFIG.duck.positions.sec0.bottom,
                y: '150vh', // 위에서 떨어지는 효과를 위해 y 사용
                scaleX: STAGE_CONFIG.duck.positions.sec0.scale,
                scaleY: STAGE_CONFIG.duck.positions.sec0.scale,
              },
              enterTime
            );
            tl.to(
              '.duck-container',
              { y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' },
              enterTime
            );
          } else {
            tl.set('.sun-wrapper, .cloud-wrapper', { y: '-150vh' }, enterTime);
            tl.to(
              '.sun-wrapper, .cloud-wrapper',
              { y: '0vh', duration: 1, ease: 'elastic.out(1, 0.5)' },
              enterTime
            );

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

            tl.set(
              '.duck-container',
              {
                left: '-50vw',
                bottom: duckPos.bottom,
                y: 0,
                scaleX: duckPos.scale,
                scaleY: duckPos.scale,
              },
              enterTime
            );

            // ⭐️ 진동수 조절 3: 화면 밖에서 걸어 들어올 때의 걸음수 (기본 16보)
            tl.add(() => playSyncWalk(2.5, 'power2.out', 10), enterTime);
            tl.to(
              '.duck-container',
              { left: duckPos.left, duration: 2.5, ease: 'power2.out' },
              enterTime
            );
          }
        } else {
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
            // ⭐️ 진동수 조절 4: 스크롤로 무대 1 <-> 2 이동할 때의 걸음수 (기본 14보)
            .add(() => playSyncWalk(2, 'power2.inOut', 10), 'walk')
            .to(
              '.ground',
              { x: xMove, duration: 2, ease: 'power2.inOut' },
              'walk'
            )
            .to(
              '.duck-container',
              {
                left: duckPos.left,
                bottom: duckPos.bottom,
                duration: 2,
                ease: 'power2.inOut',
              },
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

      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 20,
        preventDefault: false,
        onChangeY: (self) => {
          if (isAnimatingRef.current) return;
          const isTouch =
            self.event.type.includes('touch') ||
            self.event.type.includes('pointer');
          const delta = isTouch ? -self.deltaY : self.deltaY;

          if (delta > 0 && currentIndexRef.current < 2)
            goToSection(currentIndexRef.current + 1);
          else if (delta < 0 && currentIndexRef.current > 0)
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
              style={{ ...timeData.sunStyle, ...STAGE_CONFIG.sky.sun }}
            />
          </div>
        )}
        <div className="cloud-wrapper puppet" style={CLOUD_WRAPPER_STYLE}>
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud1"
            style={STAGE_CONFIG.sky.cloud1}
          />
        </div>
        <div className="cloud-wrapper puppet" style={CLOUD_WRAPPER_STYLE}>
          <img
            src={`${import.meta.env.BASE_URL}assets/Cloud.png`}
            alt="Cloud"
            className="cloud cloud2"
            style={STAGE_CONFIG.sky.cloud2}
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

        {/* ⭐️ 풍차 원상복구: 상자 안에서 이미지가 꽉 차게(absolute, 100%) 들어가야 날개 위치가 안 깨집니다! */}
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

        {/* ⭐️ 우편함 원상복구: objectFit: contain 복구! */}
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
        style={{ display: shouldPlayIris ? 'block' : 'none' }}
      ></div>
    </div>
  );
}
