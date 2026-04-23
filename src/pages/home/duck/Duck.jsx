import React, { useEffect, useRef, useState } from 'react';
import './Duck.css';

export default function Duck() {
  const duckRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // =========================================================
      // ⭐️ 핵심 방어막: 지정된 섹션이 아니면 여기서 로직을 멈춥니다 (return)
      // =========================================================
      const currentSection = document.body.getAttribute('data-section');

      // 💡 만약 가장 처음 보이는 진짜 '홈(Engineering Lab)' 화면을 뜻하신 거라면 '0'
      // 💡 풍차가 있는 첫 번째 '무대'를 뜻하신 거라면 '1'을 적어주세요!
      if (currentSection !== '0') {
        setFrameIndex(8);
        return;
      }

      // 오리 태그가 화면에 없으면 작동 안 함
      if (!duckRef.current) return;

      // ⭐️ 이미지 총 9개 (Duck_0 ~ Duck_8)
      const frameCount = 9;

      const max_angle = 270;
      const min_angle = 150;

      const rect = duckRef.current.getBoundingClientRect();
      const duckX = rect.left + rect.width / 2;
      const duckY = rect.top + rect.height / 2;

      const deltaX = e.clientX - duckX;
      const deltaY = e.clientY - duckY;

      // 아크탄젠트로 각도 구하기 (0 ~ 360도로 변환)
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      let deg = angle < 0 ? angle + 360 : angle;

      // =========================================================
      // 🕰️ 시계 로직: 12시(270도) ~ 8시(150도) = 총 120도 구간
      // =========================================================

      // 마우스가 오리의 오른쪽(1시~5시 방향)으로 넘어갔을 때 고개가 꺾이지 않게 방어
      if (deg > max_angle || deg < min_angle) {
        deg = max_angle; // 12시(가장 위)에 고정
      } else if (deg >= 60 && deg < min_angle) {
        deg = min_angle; // 8시(가장 왼쪽 아래)에 고정
      }

      // 12시(270도)일 때 progress = 0
      // 8시(150도)일 때 progress = 1
      const progress = (max_angle - deg) / (max_angle - min_angle);

      // 진행률(0~1)을 이미지 9장에 분배 (0 ~ 8)
      let newIndex = Math.floor(progress * frameCount);

      // (안전장치) 0 ~ 8 사이를 벗어나지 않도록 확정!
      newIndex = Math.max(0, Math.min(frameCount - 1, newIndex));

      // 💡 만약 위를 볼 때가 Duck_8 이고, 아래를 볼 때가 Duck_0 이라면
      // 아래 주석을 풀어서 방향을 뒤집어주세요!
      // newIndex = (frameCount - 1) - newIndex;

      setFrameIndex(newIndex);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
