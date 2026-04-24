import React, { useEffect, useRef, useState } from 'react';
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(8); // 처음부터 정면(8)으로 시작

  useEffect(() => {
    // ⭐️ [수정된 부분] 1. 마우스가 안 움직여도, 무대(data-section)가 바뀌면 바로 감지하는 감시자!
    const observer = new MutationObserver(() => {
      const currentSection = document.body.getAttribute('data-section');
      // 0번(홈) 화면이 아니면 무조건 오리를 정면(8)으로 리셋!
      if (currentSection !== '0') {
        setFrameIndex(8);
      }
    });

    // 감시 시작: body 태그의 'data-section' 속성 변화를 지켜봅니다.
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-section'],
    });

    const handleMouseMove = (e) => {
      const currentSection = document.body.getAttribute('data-section');

      // 0번 화면이 아니면 마우스를 따라다니지 않고 정면 응시
      if (currentSection !== '0') {
        setFrameIndex(8);
        return;
      }

      if (!duckRef.current) return;

      const frameCount = 9;
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
        deg = max_angle;
      } else if (deg >= 60 && deg < min_angle) {
        deg = min_angle;
      }

      const progress = (max_angle - deg) / (max_angle - min_angle);
      let newIndex = Math.floor(progress * frameCount);
      newIndex = Math.max(0, Math.min(frameCount - 1, newIndex));

      setFrameIndex(newIndex);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // 컴포넌트가 꺼질 때 감시자도 같이 꺼줍니다.
      observer.disconnect();
    };
  }, []);

  return (
    <div className="duck-sprite">
      <img
        ref={duckRef}
        src={`${
          import.meta.env.BASE_URL
        }assets/duck_sprites/Duck_${frameIndex}.png`}
        alt={`Duck Frame ${frameIndex}`}
        className="duck-image"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
