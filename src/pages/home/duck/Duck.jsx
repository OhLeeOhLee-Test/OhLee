import React, { useState, useEffect, useRef } from 'react';
import './Duck.css';

const frameCount = 9;
const duckImages = Array.from({ length: frameCount }, (_, i) => 
  `${import.meta.env.BASE_URL}duck_sprites/Duck_${i}.png`
);

export default function Duck() {
  const [frameIndex, setFrameIndex] = useState(4);
  const currentSectionRef = useRef(0);
  const targetFrameRef = useRef(4); // ⭐️ 오리가 '쳐다봐야 할' 목표 지점

  useEffect(() => {
    // 1. Home.jsx가 보낸 텔레파시 수신
    const handleSectionChange = (e) => {
      currentSectionRef.current = e.detail;
    };
    window.addEventListener('sectionChange', handleSectionChange);

    // 2. 마우스 위치를 타겟 프레임으로 변환
    const handleMouseMove = (e) => {
      if (currentSectionRef.current > 0) return; // 메인이 아니면 마우스 무시

      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      let index = Math.round(((mouseX + 1) / 2) * (frameCount - 1));
      targetFrameRef.current = Math.max(0, Math.min(frameCount - 1, index));
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ⭐️ 3. 대망의 스무딩 루프! (0.05초마다 목표를 향해 고개를 돌립니다)
    let timeoutId;
    const updateFrame = () => {
      setFrameIndex((prev) => {
        let target = currentSectionRef.current > 0 ? 8 : targetFrameRef.current;

        // 목표를 향해 프레임을 1칸씩만 이동
        if (prev < target) return prev + 1;
        if (prev > target) return prev - 1;
        return prev; // 목표에 도달했으면 정지
      });
      timeoutId = setTimeout(updateFrame, 50); // 숫자가 작을수록 고개를 빨리 돌림
    };
    updateFrame();

    return () => {
      window.removeEventListener('sectionChange', handleSectionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="duck-container">
      <img src={duckImages[frameIndex]} alt="Duck" className="duck-sprite" />
    </div>
  );
}