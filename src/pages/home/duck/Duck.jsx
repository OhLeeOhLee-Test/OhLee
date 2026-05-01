import React, { useEffect, useRef, useState } from 'react';
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null);

  // ⭐️ 1. 처음 시작할 때 기본 이미지를 32번으로 설정!
  const [frameIndex, setFrameIndex] = useState(32);
  // CSS 좌우 반전을 위해 현재 메인 무대인지 상태를 저장합니다.
  const [isMainScreen, setIsMainScreen] = useState(
    () => document.body.getAttribute('data-section') === '0'
  );

  useEffect(() => {
    // 무대(data-section)가 바뀌는 걸 감지하는 감시자
    const observer = new MutationObserver(() => {
      const currentSection = document.body.getAttribute('data-section');
      const isMain = currentSection === '0';

      // 메인인지 서브 무대인지 상태 업데이트
      setIsMainScreen(isMain);

      // ⭐️ 무대가 바뀌면(메인이든 서브든) 일단 기본 자세인 32번으로 고정!
      setFrameIndex(32);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-section'],
    });

    const handleMouseMove = (e) => {
      const currentSection = document.body.getAttribute('data-section');

      // 메인(0번) 화면이 아니면 마우스 추적을 멈추고 32번 자세 유지
      if (currentSection !== '0') {
        return;
      }

      if (!duckRef.current) return;

      // ⭐️ 2. 프레임 개수를 61개로 수정!
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
        deg = max_angle;
      } else if (deg >= 60 && deg < min_angle) {
        deg = min_angle;
      }

      const progress = (max_angle - deg) / (max_angle - min_angle);

      // ⭐️ progress(0~1)를 1~61번 이미지 번호로 매핑!
      // (만약 이미지 이름이 Duck_0.png 부터 시작한다면 뒤에 '+ 1'을 빼주세요)
      let newIndex = Math.floor(progress * frameCount);
      newIndex = Math.max(1, Math.min(frameCount, newIndex)); // 1 ~ 61 제한

      setFrameIndex(newIndex);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
        style={{
          width: '100%',
          height: 'auto',
          display: 'block', // 하단 여백 방지
          // ⭐️ 3. 메인 무대가 아닐 때(서브 무대일 때)만 32번 이미지를 좌우 반전시킴!
          transform: !isMainScreen ? 'scaleX(-1)' : 'none',
        }}
      />
    </div>
  );
}
