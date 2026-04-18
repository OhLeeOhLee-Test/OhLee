import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Punggyeong.css'; // ⭐️ 이 이름과 실제 파일 이름이 똑같아야 합니다!

export default function Punggyeong() {
  const navigate = useNavigate();

  // 상세 페이지에 들어오면 강제로 스크롤을 살려주는 안전장치
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    }; // 나가면 다시 잠금
  }, []);

  return (
    <div className="detail-container">
      <h1 className="detail-title">풍경풍경 (Scenery)</h1>
      <p className="detail-desc">
        이곳에 바람으로 작동하는 냉각 장치(WIND-er)나 풍경풍경 프로젝트에 대한
        상세한 설명이 들어갑니다.
      </p>

      {/* 임시 스크롤 테스트용 긴 박스들 */}
      <div className="content-box">사진이나 3D 모델 1</div>
      <div className="content-box">사진이나 3D 모델 2</div>
      <div className="content-box">사진이나 3D 모델 3</div>

      <button className="back-btn" onClick={() => navigate('/')}>
        ← 메인으로 돌아가기
      </button>
    </div>
  );
}
