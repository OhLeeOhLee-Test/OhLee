import React, { useLayoutEffect, useRef } from 'react';
import Duck from './duck/Duck.jsx';
import './Home.css';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export default function Home() {
  const homeRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let currentIndex = 0;
      let isAnimating = false;

      document.body.setAttribute('data-section', currentIndex);

      // ⭐️ 1. 초기 세팅: 프로젝트, 컨택, 그리고 '땅'을 화면 밖에 숨깁니다.
      gsap.set('.project-panel', { yPercent: 100 });
      gsap.set('.contact-panel', { xPercent: 100 });
      gsap.set('.ground', { yPercent: 100 }); // 땅은 바닥 아래에 대기!

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: 'power2.inOut' },
      });

      // 🎥 1단계: 줌아웃 & 땅 등장
      tl.addLabel('step0')
        .to('.home-panel', { yPercent: -100 }, 'step1')
        .to('.project-panel', { yPercent: 0 }, 'step1')
        .to('.ground', { yPercent: 0 }, 'step1') // ⭐️ 땅이 밑에서 스르륵 올라옵니다!
        .to('.duck-container', { scale: 0.4, x: '-35vw', y: '15vh' }, 'step1') // ⭐️ 오리가 작아지며 왼쪽 땅 위에 착지!
        .addLabel('step1')

        // 🎥 2단계: 땅 위를 걸어서 오른쪽으로 이동!
        .to('.project-panel', { xPercent: -100 }, 'step2')
        .to('.contact-panel', { xPercent: 0 }, 'step2')
        .to('.duck-container', { x: '35vw' }, 'step2') // ⭐️ 착지한 높이 그대로 우측으로 스윽 걸어갑니다!
        .addLabel('step2');

      const goToSection = (newIndex) => {
        isAnimating = true;
        currentIndex = newIndex;
        document.body.setAttribute('data-section', currentIndex);
        window.dispatchEvent(
          new CustomEvent('sectionChange', { detail: currentIndex })
        );
        tl.tweenTo(`step${currentIndex}`, {
          onComplete: () => (isAnimating = false),
        });
      };

      Observer.create({
        target: window,
        type: 'wheel,touch',
        tolerance: 10,
        preventDefault: true,
        onDown: () => {
          if (!isAnimating && currentIndex < 2) goToSection(currentIndex + 1);
        },
        onUp: () => {
          if (!isAnimating && currentIndex > 0) goToSection(currentIndex - 1);
        },
      });
    }, homeRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="home-container" ref={homeRef}>
      <Duck />

      {/* ⭐️ 배경에 깔릴 새로운 대지(땅)입니다 */}
      <div className="ground"></div>

      <div className="panels-container">
        <section className="panel home-panel">
          <h1>Engineering Lab</h1>
          <p>휠을 딱 한 번만 내려보세요 ↓</p>
        </section>
        <section className="panel project-panel">
          <h2>Projects</h2>
          <div className="project-list">
            <div className="project-card">풍경풍경</div>
          </div>
        </section>
        <section className="panel contact-panel">
          <h2>Contact Me</h2>
          <p>Ready to Work</p>
        </section>
      </div>
    </div>
  );
}
