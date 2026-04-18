import React from 'react';
import { useNavigate } from 'react-router-dom';
import StlViewer from '../../StlViewer';
import './Punggyeong.css';

export default function Punggyeong() {
  const navigate = useNavigate();

  return (
    <main className="detail-view">
      <button className="back-btn" onClick={() => navigate('/projects')}>
        ← 뒤로 가기
      </button>

      <h2>풍경풍경 (Cloud Bell)</h2>

      <div className="specs-container">
        {/* 3D 뷰어를 상단에 크게 배치 */}
        <div className="detail-3d-container">
          <StlViewer autoRotate={false} controls={true} scale={0.03} />
        </div>

        {/* 설명 글씨는 뷰어 아래로 */}
        <div className="engineering-log">
          <h3>⚙️ Engineering Specs</h3>
          <ul>
            <li>
              <strong>Mechanism:</strong> 1-DOF 3층 적층 구조 설계
            </li>
            <li>
              <strong>Actuator:</strong> 서보모터 1개를 활용한 제어 최적화 및
              배선 최소화
            </li>
            <li>
              <strong>Design Challenge:</strong> 2.5mm 캐노피 두께를 고려한 모듈
              1.0 이하 정밀 랙 앤 피니언 적용
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
