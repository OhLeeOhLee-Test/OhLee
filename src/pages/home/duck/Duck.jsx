import React, { useState, useEffect, useRef } from 'react';
import './Duck.css';

const frameCount = 9;
const duckImages = Array.from(
  { length: frameCount },
  (_, i) => `${import.meta.env.BASE_URL}assets/duck_sprites/Duck_${i}.png`
);

export default function Duck() {
  const [frameIndex, setFrameIndex] = useState(4);
  const currentSectionRef = useRef(0);
  const targetFrameRef = useRef(4);

  // ⭐️ 1. 순수하게 소리와 점프만 남은 꽥 함수
  const playQuack = () => {
    const audio = new Audio(`${import.meta.env.BASE_URL}assets/quack.mp3`);
    audio.play().catch((e) => console.log('소리 재생 에러:', e));

    const duckEl = document.getElementById('my-duck');
    if (duckEl) {
      duckEl.style.transform = 'translateY(-20px)';
      setTimeout(() => (duckEl.style.transform = 'translateY(0)'), 150);
    }
  };

  useEffect(() => {
    const handleSectionChange = (e) => {
      currentSectionRef.current = e.detail;
    };
    window.addEventListener('sectionChange', handleSectionChange);

    // 데스크톱 마우스 추적
    const handleMouseMove = (e) => {
      if (currentSectionRef.current > 0) return;
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      let index = Math.round(((mouseX + 1) / 2) * (frameCount - 1));
      targetFrameRef.current = Math.max(0, Math.min(frameCount - 1, index));
    };

    // ⭐️ 2. 모바일 기기 기울기(Gyroscope) 추적
    const handleOrientation = (e) => {
      if (currentSectionRef.current > 0) return;

      // gamma: 왼쪽/오른쪽 기울기 각도 (-90 ~ 90)
      let gamma = e.gamma || 0;
      // UX를 위해 각도를 -45도 ~ 45도 사이로 제한
      gamma = Math.max(-45, Math.min(45, gamma));

      // -45~45 각도를 0~1 사이의 비율로 변환
      const normalized = 1 - (gamma + 45) / 90;
      let index = Math.round(normalized * (frameCount - 1));
      targetFrameRef.current = Math.max(0, Math.min(frameCount - 1, index));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation); // 기울기 감지기 부착!

    // 부드러운 고개 돌리기 (기존과 동일)
    let timeoutId;
    const updateFrame = () => {
      setFrameIndex((prev) => {
        let target = currentSectionRef.current > 0 ? 8 : targetFrameRef.current;
        if (prev < target) return prev + 1;
        if (prev > target) return prev - 1;
        return prev;
      });
      timeoutId = setTimeout(updateFrame, 50);
    };
    updateFrame();

    return () => {
      window.removeEventListener('sectionChange', handleSectionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    // ⭐️ onClick 이벤트 추가!
    <div
      className="duck-container"
      onClick={playQuack}
      style={{ cursor: 'pointer' }}
    >
      <img
        id="my-duck"
        src={duckImages[frameIndex]}
        alt="Duck"
        className="duck-sprite"
        style={{ transition: 'transform 0.15s ease-out' }} // 점프를 위한 트랜지션
      />
    </div>
  );
}
