import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Center, Environment } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// 🦆 오리 모델 부품
function DuckModel({ scale = 0.01 }) {
  const fileUrl = import.meta.env.BASE_URL + 'RubberDuck.stl';
  const geometry = useLoader(STLLoader, fileUrl);

  React.useEffect(() => {
    geometry.computeVertexNormals(); // ← 이 줄 추가 강추!
  }, [geometry]);

  return (
    <mesh
      geometry={geometry}
      scale={scale}
      // ⭐️ 1. 오리 세우기: X축으로 -90도(-Math.PI / 2) 회전시켜 Y-up 좌표계에 맞춥니다.
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#ffcc00"
        roughness={0.005} // 광택 극대화
        metalness={0.3} // 빛 반사 효과
      />
    </mesh>
  );
}

// ⭐️ 3D 뷰어 모듈
export default function StlViewer({
  autoRotate = false,
  controls = true,
  scale = 0.05,
}) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a' }}>
      <Canvas shadows camera={{ position: [4, 4, 4], fov: 40 }}>
        {/* ⭐️ 2. 자가 그림자 전용 조명 세팅 */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          // 그림자의 선명도를 높이기 위한 영점 조절
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* 주변 환경 반사광을 추가해 광택을 더 살려줍니다. */}
        <Environment preset="studio" />

        <Suspense fallback={<Html center></Html>}>
          <Center>
            <DuckModel scale={scale} />
          </Center>

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={3}
            enableRotate={controls}
            enableZoom={controls}
            enablePan={controls}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
