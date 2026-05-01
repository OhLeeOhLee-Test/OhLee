import React, { useEffect, useRef, useState } from 'react';
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null);
  
  const [frameIndex, setFrameIndex] = useState(32); 
  // ⭐️ 수정 1: 처음에 찰나의 순간 뒤집히는 버그 방지 (무조건 처음엔 정방향으로 시작!)
  const [isFlipped, setIsFlipped] = useState(false); 

  const targetFrame = useRef(32); 
  const currentFrame = useRef(32); 
  const lastRenderedFrame = useRef(32); 
  const requestRef = useRef();
  
  // ⭐️ 안전장치: 무대를 빠르게 넘나들 때 타이머가 꼬이는 걸 방지
  const flipTimeoutRef = useRef(null);

  useEffect(() => {
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
      
      // 기존에 돌고 있던 반전 타이머가 있다면 캔슬 (빠른 스크롤 대비)
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);

      if (currentSection !== '0') {
        // [섹션 2, 3으로 갈 때]
        targetFrame.current = 32; 
        flipTimeoutRef.current = setTimeout(() => setIsFlipped(true), 800); 
      } else {
        // [섹션 1 메인으로 돌아올 때]
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

      const frameCount = 61; // 총 61장 (0 ~ 60)
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
      
      // ⭐️ 수정 2: +1을 삭제하여 0 ~ 60번 이미지가 나오도록 매핑!
      let newIndex = Math.floor(progress * frameCount);
      newIndex = Math.max(0, Math.min(frameCount - 1, newIndex)); // 최소 0, 최대 60 보장

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

  return (
    <div className="duck-sprite">
      <img
        ref={duckRef}
        src={`${import.meta.env.BASE_URL}assets/duck_sprites/Duck_${frameIndex}.png`}
        alt={`Duck Frame ${frameIndex}`}
        className="duck-image"
        style={{ 
          width: '100%', 
          height: 'auto',
          display: 'block',
          transform: isFlipped ? 'scaleX(-1)' : 'none' 
        }}
      />
    </div>
  );
}
