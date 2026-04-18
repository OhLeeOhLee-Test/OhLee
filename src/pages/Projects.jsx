import React from 'react';
import { useNavigate } from 'react-router-dom';
import StlViewer from '../StlViewer';
import './Projects.css';

export default function Projects() {
  const navigate = useNavigate();

  return (
    <main className="gallery-view">
      <h2>Engineering Portfolio</h2>
      <div className="grid-container">
        <div className="project-card" onClick={() => navigate('/punggyeong')}>
          <div className="featured-3d-bracket">
            {/* 메인에서는 자동회전 ON, 조작 OFF */}
            <StlViewer autoRotate={true} controls={false} scale={0.03} />
          </div>
          <div className="card-text">
            <h3>풍경풍경 (Cloud Bell)</h3>
            <p>날씨 반응형 스마트 풍경</p>
          </div>
        </div>

        <div className="project-card" onClick={() => navigate('/web')}>
          <div className="card-image">🌐</div>
          <div className="card-text">
            <h3>Engineering Portfolio Web</h3>
            <p>React 기반의 연구 기록 및 데이터 시각화 시스템</p>
          </div>
        </div>

        <div className="project-card disabled">
          <div className="card-image">⏳</div>
          <div className="card-text">
            <h3>Project 03</h3>
            <p>준비 중</p>
          </div>
        </div>
      </div>
    </main>
  );
}
