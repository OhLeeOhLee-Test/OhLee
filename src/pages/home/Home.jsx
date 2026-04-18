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

      // ⭐️ 1. 텍스트 겹침 방지! 프로젝트 화면은 아래에, 컨택은 오른쪽에 숨깁니다.
      gsap.set('.project-panel', { yPercent: 100 });
      gsap.set('.contact-panel', { xPercent: 100 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: 'power2.inOut' },
      });

      tl.addLabel('step0')
        .to('.home-panel', { yPercent: -100 }, 'step1')
        .to('.project-panel', { yPercent: 0 }, 'step1')

        // ⭐️ 오리 동선 수정: 크기를 줄이고 왼쪽(-40vw) 아래(35vh)로 이동!
        .to('.duck-container', { scale: 0.4, x: '-40vw', y: '35vh' }, 'step1')

        .addLabel('step1')
        .to('.project-panel', { xPercent: -100 }, 'step2')

        // ⭐️ 2번(컨택) 화면으로 갈 때 오리 코드는 뺐습니다. (왼쪽 아래에 그대로 고정!)
        .to('.contact-panel', { xPercent: 0 }, 'step2')

        .addLabel('step2');

      const goToSection = (newIndex) => {
        isAnimating = true;
        currentIndex = newIndex;

        // ⭐️ 3. 오리에게 텔레파시(Event) 보내기
        window.dispatchEvent(
          new CustomEvent('sectionChange', { detail: currentIndex })
        );

        tl.tweenTo(`step${currentIndex}`, {
          onComplete: () => (isAnimating = false),
        });
      };

      // 휠 이벤트 감지기 (방향 정상화 완료)
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
