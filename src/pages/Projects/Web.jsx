import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import './Web.css';

// 🖥️ 1. 모니터 껍데기를 없앤 '공중 부양 스크린'
function FloatingScreen() {
  return (
    // 화면을 살짝 비틀어서 3D 공간에 있다는 걸 보여줍니다 (-15도)
    <group rotation={[0, -Math.PI / 12, 0]}>
      
      {/* ⭐️ 모니터 본체(mesh), 기둥, 받침대 다 갖다 버렸습니다! */}
      
      <Html
        position={[0, 0, 0]}  // 이제 허공이 기준이므로 0에 둡니다.
        transform 
        distanceFactor={1.5}  // 화면 크기 (필요에 따라 조절하세요)
        // 본체가 없으므로 뒤로 숨기는 occlude 속성도 지웠습니다.
      >
        <iframe
          title="Embedded Portfolio"
          src={import.meta.env.BASE_URL}
          style={{
            width: '1024px',
            height: '680px',
            border: 'none',
            borderRadius: '16px', /* 모서리를 둥글게 깎으면 태블릿처럼 예뻐집니다 */
            background: '#fff',
            /* ⭐️ 핵심: 공중에 뜬 느낌을 극대화하기 위해 '그림자'를 강하게 줍니다 */
            boxShadow: '0px 30px 60px rgba(0, 0, 0, 0.6)' 
          }}
        />
      </Html>
    </group>
  );
}

// 🌐 2. 메인 화면 조립
export default function Web() {
  const navigate = useNavigate();

  return (
    <main className="detail-view">
      {/* 상단 네비게이션 */}
      <button className="back-btn" onClick={() => navigate('/projects')}>
        ← 프로젝트 목록으로
      </button>

      <h2>Engineering Portfolio Web</h2>

      {/* ⭐️ 3D 장면이 들어갈 상자 (헤더 밑으로 깔리게 설계됨) */}
      <div className="web-3d-scene">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
          {/* 조명 세팅 */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />

          {/* 아까 만든 컴퓨터 조립 */}
          <FloatingScreen />

          {/* 마우스 조작 부품 (확대/축소, 회전 가능) */}
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>
      </div>

      {/* 하단 설명글 */}
      <div className="specs-container">
        <div className="engineering-log">
          <h3>Project Architecture</h3>
          <p>
            React 기반의 싱글 페이지 애플리케이션(SPA)으로 구축된 포트폴리오
            웹사이트입니다. Three.js와 React Three Fiber를 활용하여 3D 시각화
            모듈을 통합하였으며, 지금 보고 계신 이 화면 또한 가상 공간 내에
            렌더링 된 재귀적(Recursive) 구조를 가지고 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
