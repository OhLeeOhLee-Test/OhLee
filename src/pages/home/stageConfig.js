// stageConfig.js

export const getStageConfig = (device) => {
  // 전체적인 크기 비율 (모바일 60%, 태블릿 80%, PC 100%)
  const scale = device === 'mobile' ? 0.6 : device === 'tablet' ? 0.8 : 1;

  return {
    // sec2(우편함 섹션)로 갈 때 땅(.ground)이 왼쪽으로 얼마나 이동할지 정합니다.
    groundOffset: device === 'mobile' ? '-120vw' : '-200vw',

    // 📝 메인 화면 텍스트 위치
    homeText: {
      left: device === 'mobile' ? '10vw' : '15vw',
      top: device === 'mobile' ? '15vh' : '40vh',
    },

    // 🦆 오리 위치 및 크기
    duck: {
      outDir: 'bottom',
      positions: {
        sec0: {
          x: device === 'mobile' ? '45vw' : '25vw',
          y: device === 'mobile' ? '55vh' : '-20vh',
          scale: device === 'mobile' ? 3 : 1,
        },
        sec1: {
          x: device === 'mobile' ? '-10vw' : '-35vw',
          y: device === 'mobile' ? '30vh' : '0vh',
          scale: device === 'mobile' ? 0.25 : 0.4,
        },
        sec2: {
          x: device === 'mobile' ? '-10vw' : '-35vw',
          y: device === 'mobile' ? '30vh' : '0vh',
          scale: device === 'mobile' ? 0.25 : 0.4,
        },
      },
    },

    // ☀️ 구름과 태양 (퇴장 방향 + 크기, 위치 설정)
    sky: {
      sun: {
        width: device === 'mobile' ? '30vw' : '20vw',
        baseY: 40, // 🌅 해가 뜨고 지는 기본 바닥 높이 (vh)
        amplitude: 30, // ☀️ 정오에 위로 얼마나 솟구칠지 궤도 높이 (vh)
        outDir: 'top',
      },
      cloud1: {
        top: '10vh', // ⭐️ 구름 높낮이
        width: device === 'mobile' ? '40vw' : '20vw', // ⭐️ 구름 크기
        opacity: 0.7,
        outDir: 'top',
      },
      cloud2: {
        top: '5vh',
        width: device === 'mobile' ? '30vw' : '15vw',
        opacity: 0.7,
        outDir: 'top',
      },
    },

    // 🌍 1번 무대 넓은 맵 에셋 배치
    sec1: {
      tree: { left: '5vw', width: `${250 * scale}px`, outDir: 'bottom' },
      grass1: { left: '20vw', width: `${80 * scale}px`, outDir: 'left' },
      grass1_sub: { left: '30vw', width: `${60 * scale}px`, outDir: 'bottom' },
      rock: { left: '40vw', width: `${100 * scale}px`, outDir: 'bottom' },

      // ⚙️ 풍차
      windmill: {
        left: '60vw',
        width: `${200 * scale}px`,
        height: `${400 * scale}px`,
        zIndex: 10,
        outDir: 'bottom',
        walkToX: device === 'mobile' ? '5vw' : '10vw',
      },
    },

    // 🌍 2번 무대 우편함 맵 배치
    sec2: {
      tree: { left: '90vw', width: `${250 * scale}px`, outDir: 'bottom' },
      grass2: { left: '110vw', width: `${90 * scale}px`, outDir: 'bottom' },
      grass2_sub: { left: '130vw', width: `${70 * scale}px`, outDir: 'bottom' },

      // 📬 우편함 (PC는 화면 1개 반 거리, 모바일은 화면이 작으니 살짝 가깝게)
      mailbox: {
        left: '280vw',
        width: `${150 * scale}px`,
        height: `${300 * scale}px`,
        zIndex: 10,
        outDir: 'bottom',
        walkToX: device === 'mobile' ? '5vw' : '30vw',
      },
      rock: { left: '170vw', width: `${120 * scale}px`, outDir: 'bottom' },
    },
  };
};
