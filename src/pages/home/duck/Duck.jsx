import React, { useEffect, useRef, useState } from 'react';
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null);
  
  const [frameIndex, setFrameIndex] = useState(32); 
  // 좌우 반전 상태 (처음 렌더링 시 메인이면 false, 아니면 true)
  const [isFlipped, setIsFlipped] = useState(() => document.body.getAttribute('data-section') !== '0');

  // ⭐️ 자연스러운 고개 움직임을 위한 부드러운 애니메이션(Lerp) 상태값들
  const targetFrame = useRef(32); // 오리가 바라봐야 할 목표 프레임
  const currentFrame = useRef(32); // 오리의 현재 실제 프레임 (소수점 포함)
  const lastRenderedFrame = useRef(32); // 리렌더링 방지용
  const requestRef = useRef();

  useEffect(() => {
    // ⭐️ 1. 스무스 애니메이션 루프: 목표 프레임을 향해 부드럽게 프레임을 이동시킵니다!
    const animateHead = () => {
      if (currentFrame.current !== targetFrame.current) {
        const diff = targetFrame.current - currentFrame.current;
        
        // 0.15 = 15%씩 목표를 향해 이동 (더 부드럽게 하려면 0.1, 빠르게 하려면 0.3)
        currentFrame.current += diff * 0.15; 

        // 목표에 거의 다다르면 딱 맞춰줌
        if (Math.abs(diff) < 0.5) {
          currentFrame.current = targetFrame.current;
        }

        const roundedFrame = Math.round(currentFrame.current);
        // 프레임 정수값이 바뀌었을 때만 리액트 렌더링을 시켜서 최적화
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
    // ⭐️ 2. 감시자: 무대가 바뀔 때 '몰래' 뒤집기 로직
    const observer = new MutationObserver(() => {
      const currentSection = document.body.getAttribute('data-section');
      
      if (currentSection !== '0') {
        // [섹션 2, 3으로 갈 때]
        targetFrame.current = 32; // 즉시 정면을 보도록 세팅
        // 🚨 오리가 땅으로 완전히 꺼지는 시간(0.8초)을 기다렸다가 몰래 좌우 반전!
        setTimeout(() => setIsFlipped(true), 800); 
      } else {
        // [섹션 1 메인으로 돌아올 때]
        // 🚨 마찬가지로 오리가 땅에 숨어있을 때 몰래 반전을 풀어줍니다.
        setTimeout(() => {
          targetFrame.current = 32;
          setIsFlipped(false);
        }, 800);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-section'],
    });

    const handleMouseMove = (e) => {
      const currentSection = document.body.getAttribute('data-section');

      // 메인(0번) 화면이 아니면 마우스 추적 완전 중지
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

      // ⭐️ 핵심 1: 마우스가 120도 범위를 벗어나면 목표를 무조건 32번으로!
      if (deg > max_angle || deg < min_angle) {
        targetFrame.current = 32;
        return;
      }

      // ⭐️ 핵심 3: 마우스 방향과 고개 방향이 일치하도록 계산식을 뒤집음! (deg - min_angle)
      const progress = (deg - min_angle) / (max_angle - min_angle);
      
      let newIndex = Math.floor(progress * frameCount) + 1;
      newIndex = Math.max(1, Math.min(frameCount, newIndex));

      // 당장 프레임을 바꾸는 게 아니라 "목표 프레임"만 설정해 둠
      targetFrame.current = newIndex;
    };

    // ⭐️ 마우스가 화면 밖으로 나갔을 때의 이벤트 (자연스럽게 32번으로 돌아오기)
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
        // 만약 이미지 파일명이 Duck_0.png ~ Duck_60.png 라면 frameIndex - 1 로 수정해주세요.
        src={`${import.meta.env.BASE_URL}assets/duck_sprites/Duck_${frameIndex}.png`}
        alt={`Duck Frame ${frameIndex}`}
        className="duck-image"
        style={{ 
          width: '100%', 
          height: 'auto',
          display: 'block', // 하단 여백 버그 방지
          // 몰래 좌우 반전 적용
          transform: isFlipped ? 'scaleX(-1)' : 'none' 
        }}
      />
    </div>
  );
}
