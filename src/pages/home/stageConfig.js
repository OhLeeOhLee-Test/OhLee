// stageConfig.js

export const getStageConfig = (device) => {
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
          left: device === 'mobile' ? '85vw' : '90vw',
          // ⭐️ 모바일 전체적으로 +15vw 상승!
          bottom: device === 'mobile' ? '15vw' : '-125vh',
          scale: device === 'mobile' ? 3 : 1.5,
        },
        sec1: {
          left: device === 'mobile' ? '50vw' : '15vw',
          bottom: device === 'mobile' ? '47vw' : '-50vh',
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
        sec2: {
          left: device === 'mobile' ? '50vw' : '-35vw',
          bottom: device === 'mobile' ? '47vw' : '0vh',
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

    // 🌍 1번 무대
    sec1: {
      // ⭐️ 모바일 전체적으로 +15vw 상승!
      tree: {
        left: device === 'mobile' ? '15vw' : '15vw',
        bottom: device === 'mobile' ? '51vw' : '0vh',
        width: device === 'mobile' ? '30vw' : '100px',
        outDir: 'bottom',
      },
      grass1: {
        left: device === 'mobile' ? '40vw' : '20vw',
        bottom: device === 'mobile' ? '55vw' : '0vh',
        width: device === 'mobile' ? '20vw' : '80px',
        outDir: 'bottom',
      },
      grass1_sub: {
        left: device === 'mobile' ? '30vw' : '30vw',
        bottom: device === 'mobile' ? '25vw' : '0vh',
        width: device === 'mobile' ? '10vw' : '60px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '80vw' : '40vw',
        bottom: device === 'mobile' ? '21vw' : '0vh',
        width: device === 'mobile' ? '22vw' : '100px',
        outDir: 'bottom',
      },

      windmill: {
        left: device === 'mobile' ? '80vw' : '50vw',
        bottom: device === 'mobile' ? '15vw' : '2vh',
        width: device === 'mobile' ? '120vw' : '200px',
        height: device === 'mobile' ? '240vw' : '400px',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '60vw' : '10vw',
      },
    },

    // 🌍 2번 무대
    sec2: {
      // ⭐️ 모바일 전체적으로 +15vw 상승!
      tree: {
        left: device === 'mobile' ? '225vw' : '90vw',
        bottom: device === 'mobile' ? '58vw' : '0vh',
        width: device === 'mobile' ? '50vw' : '250px',
        outDir: 'bottom',
      },
      grass2: {
        left: device === 'mobile' ? '150vw' : '110vw',
        bottom: device === 'mobile' ? '21vw' : '0vh',
        width: device === 'mobile' ? '13vw' : '90px',
        outDir: 'bottom',
      },
      grass2_sub: {
        left: device === 'mobile' ? '120vw' : '130vw',
        bottom: device === 'mobile' ? '55vw' : '0vh',
        width: device === 'mobile' ? '25vw' : '70px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '210vw' : '170vw',
        bottom: device === 'mobile' ? '19vw' : '0vh',
        width: device === 'mobile' ? '38vw' : '120px',
        outDir: 'bottom',
      },

      mailbox: {
        left: device === 'mobile' ? '200vw' : '280vw',
        bottom: device === 'mobile' ? '28vw' : '0vh',
        width: device === 'mobile' ? '190vw' : '150px',
        height: device === 'mobile' ? '380vw' : '300px',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '55vw' : '30vw',
      },
    },
  };
};
