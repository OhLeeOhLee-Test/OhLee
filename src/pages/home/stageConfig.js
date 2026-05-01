// stageConfig.js

export const getStageConfig = (device) => {
  // ⭐️ 뭉뚱그려 쓰던 scale 변수는 완전히 삭제했습니다! 이제 모든 걸 직접 통제합니다.

  return {
    groundOffset: device === 'mobile' ? '-120vw' : '-200vw',

    homeText: {
      left: device === 'mobile' ? '10vw' : '15vw',
      top: device === 'mobile' ? '15vh' : '40vh',
    },

    duck: {
      outDir: 'bottom',
      positions: {
        sec0: {
          x: device === 'mobile' ? '45vw' : '25vw',
          y: device === 'mobile' ? '55vh' : '-20vh',
          scale: device === 'mobile' ? 3 : 1,
        },
        sec1: {
          x: device === 'mobile' ? '-30vw' : '-35vw',
          y: device === 'mobile' ? '20vh' : '0vh',
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
        sec2: {
          x: device === 'mobile' ? '-30vw' : '-35vw',
          y: device === 'mobile' ? '20vh' : '0vh',
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
      },
    },

    sky: {
      sun: {
        width: device === 'mobile' ? '30vw' : '20vw',
        baseY: 50,
        amplitude: 40,
        outDir: 'top',
      },
      cloud1: {
        top: device === 'mobile' ? '30vh' : '5vh',
        width: device === 'mobile' ? '40vw' : '20vw',
        opacity: 0.7,
        outDir: 'top',
      },
      cloud2: {
        top: device === 'mobile' ? '20vh' : '5vh',
        width: device === 'mobile' ? '30vw' : '15vw',
        opacity: 0.7,
        outDir: 'top',
      },
    },

    // 🌍 1번 무대 (풍차 및 주변 환경)
    sec1: {
      tree: {
        left: device === 'mobile' ? '0vw' : '15vw',
        bottom: device === 'mobile' ? '17vh' : '0vh',
        width: device === 'mobile' ? '120px' : '100px',
        outDir: 'bottom',
      },
      grass1: {
        left: device === 'mobile' ? '40vw' : '20vw',
        bottom: device === 'mobile' ? '19vh' : '0vh',
        width: device === 'mobile' ? '75px' : '80px',
        outDir: 'bottom',
      },
      grass1_sub: {
        left: device === 'mobile' ? '25vw' : '30vw',
        bottom: device === 'mobile' ? '5vh' : '0vh',
        width: device === 'mobile' ? '40px' : '60px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '80vw' : '40vw',
        bottom: device === 'mobile' ? '3vh' : '0vh',
        width: device === 'mobile' ? '85px' : '100px',
        outDir: 'bottom',
      },

      // ⚙️ 풍차
      windmill: {
        left: device === 'mobile' ? '45vw' : '50vw',
        bottom: device === 'mobile' ? '-12vh' : '2vh',
        width: device === 'mobile' ? '480px' : '200px',
        height: device === 'mobile' ? '960px' : '400px',
        zIndex: 10,
        outDir: 'bottom',
        walkToX: device === 'mobile' ? '0vw' : '10vw',
      },
    },

    // 🌍 2번 무대 (우편함 및 주변 환경)
    sec2: {
      tree: {
        left: device === 'mobile' ? '210vw' : '90vw',
        bottom: device === 'mobile' ? '17vh' : '0vh',
        width: device === 'mobile' ? '150px' : '250px',
        outDir: 'bottom',
      },
      grass2: {
        left: device === 'mobile' ? '150vw' : '110vw',
        bottom: device === 'mobile' ? '3vh' : '0vh',
        width: device === 'mobile' ? '50px' : '90px',
        outDir: 'bottom',
      },
      grass2_sub: {
        left: device === 'mobile' ? '120vw' : '130vw',
        bottom: device === 'mobile' ? '19vh' : '0vh',
        width: device === 'mobile' ? '100px' : '70px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '210vw' : '170vw',
        bottom: device === 'mobile' ? '-2vh' : '0vh',
        width: device === 'mobile' ? '150px' : '120px',
        outDir: 'bottom',
      },

      // 📬 우편함
      mailbox: {
        left: device === 'mobile' ? '150vw' : '280vw',
        bottom: device === 'mobile' ? '-37vh' : '0vh',
        width: device === 'mobile' ? '750px' : '150px',
        height: device === 'mobile' ? '1500px' : '300px',
        zIndex: 10,
        outDir: 'bottom',
        walkToX: device === 'mobile' ? '5vw' : '30vw',
      },
    },
  };
};
