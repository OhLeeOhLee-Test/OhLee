import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap'; // ⭐️ 들썩임 애니메이션을 위해 GSAP 추가!
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null); // 오리 이미지 조종용
  const spriteRef = useRef(null); // ⭐️ 오리를 감싼 박스 조종용 (들썩임 전용)

  const [frameIndex, setFrameIndex] = useState(32);
  const [isFlipped, setIsFlipped] = useState(false);

  const targetFrame = useRef(32);
  const currentFrame = useRef(32);
  const lastRenderedFrame = useRef(32);
  const requestRef = useRef();

  const flipTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // 꽥꽥 사운드 미리 로드
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}assets/Quack.mp3`);

    const animateHead = () => {
      if (currentFrame.current !== targetFrame.current) {
        const diff = targetFrame.current - currentFrame.current;

        currentFrame.current += diff * 0.15;

        if (Math.abs(diff) < 0.5) {
          currentFrame.current = targetFrame.current;
        }

        const roundedFrame = Math.round(currentFrame.current);
        if (roundedFrame !== lastRenderedFrame.current) {
          setFrameIndex(roundedFrame);
          lastRenderedFrame.current = roundedFrame;
        }
      }
      requestRef.current = requestAnimationFrame(animateHead);
    };

    requestRef.current = requestAnimationFrame(animateHead);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentSection = document.body.getAttribute('data-section');

      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);

      if (currentSection !== '0') {
        targetFrame.current = 32;
        flipTimeoutRef.current = setTimeout(() => setIsFlipped(true), 800);
      } else {
        targetFrame.current = 32;
        flipTimeoutRef.current = setTimeout(() => setIsFlipped(false), 800);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-section'],
    });

    const handleMouseMove = (e) => {
      const currentSection = document.body.getAttribute('data-section');

      if (currentSection !== '0') return;
      if (!duckRef.current) return;

      const frameCount = 61;
      const max_angle = 270;
      const min_angle = 150;

      const rect = duckRef.current.getBoundingClientRect();
      const duckX = rect.left + rect.width / 2;
      const duckY = rect.top + rect.height / 2;

      const deltaX = e.clientX - duckX;
      const deltaY = e.clientY - duckY;

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      let deg = angle < 0 ? angle + 360 : angle;

      if (deg > max_angle || deg < min_angle) {
        targetFrame.current = 32;
        return;
      }

      const progress = (deg - min_angle) / (max_angle - min_angle);

      let newIndex = Math.floor(progress * frameCount);
      newIndex = Math.max(0, Math.min(frameCount - 1, newIndex));

      targetFrame.current = newIndex;
    };

    const handleMouseLeave = () => {
      const currentSection = document.body.getAttribute('data-section');
      if (currentSection === '0') {
        targetFrame.current = 32;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  // ⭐️ 꽥꽥 소리와 함께 들썩이는 로직!
  const handleDuckClick = () => {
    // 1. 소리 재생
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // 2. 들썩임 애니메이션 (GSAP)
    if (spriteRef.current) {
      // 혹시 여러 번 광클했을 때 애니메이션이 꼬이지 않도록 이전 움직임을 킬(kill)
      gsap.killTweensOf(spriteRef.current);

      // 위로 15px 튀어 올랐다가(yoyo), 제자리로 돌아옴(repeat: 1)
      gsap.fromTo(
        spriteRef.current,
        { y: 0 },
        { y: -15, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }
      );
    }
  };

  return (
    // ⭐️ 껍데기(spriteRef) 전체가 들썩이도록 ref 연결!
    <div className="duck-sprite" ref={spriteRef}>
      <img
        ref={duckRef}
        src={`${
          import.meta.env.BASE_URL
        }assets/duck_sprites/Duck_${frameIndex}.png`}
        alt={`Duck Frame ${frameIndex}`}
        className="duck-image"
        onClick={handleDuckClick}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transform: isFlipped ? 'scaleX(-1)' : 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
