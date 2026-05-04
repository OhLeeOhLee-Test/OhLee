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
          left: device === 'mobile' ? '95vw' : '90vw',
          bottom: device === 'mobile' ? '-200px' : '-125vh',
          scale: device === 'mobile' ? 3 : 1.5,
        },
        sec1: {
          left: device === 'mobile' ? '15vw' : '15vw',
          bottom: device === 'mobile' ? '125px' : '-50vh',
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
        sec2: {
          left: device === 'mobile' ? '15vw' : '15vw',
          bottom: device === 'mobile' ? '125px' : '0vh',
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
      tree: {
        left: device === 'mobile' ? '10vw' : '15vw',
        bottom: device === 'mobile' ? '190px' : '0vh',
        width: device === 'mobile' ? '30vw' : '100px',
        outDir: 'bottom',
      },
      grass1: {
        left: device === 'mobile' ? '40vw' : '20vw',
        bottom: device === 'mobile' ? '190px' : '0vh',
        width: device === 'mobile' ? '20vw' : '80px',
        outDir: 'bottom',
      },
      grass1_sub: {
        left: device === 'mobile' ? '30vw' : '30vw',
        bottom: device === 'mobile' ? '60px' : '0vh',
        width: device === 'mobile' ? '10vw' : '60px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '80vw' : '40vw',
        bottom: device === 'mobile' ? '50px' : '0vh',
        width: device === 'mobile' ? '22vw' : '100px',
        outDir: 'bottom',
      },

      windmill: {
        left: device === 'mobile' ? '80vw' : '50vw',
        bottom: device === 'mobile' ? '150px' : '2vh',
        width: device === 'mobile' ? '60vw' : '200px',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '60vw' : '10vw',
      },
    },

    // 🌍 2번 무대
    sec2: {
      tree: {
        left: device === 'mobile' ? '225vw' : '90vw',
        bottom: device === 'mobile' ? '250px' : '0vh',
        width: device === 'mobile' ? '40vw' : '250px',
        outDir: 'bottom',
      },
      grass2: {
        left: device === 'mobile' ? '175vw' : '110vw',
        bottom: device === 'mobile' ? '100px' : '0vh',
        width: device === 'mobile' ? '13vw' : '90px',
        outDir: 'bottom',
      },
      grass2_sub: {
        left: device === 'mobile' ? '120vw' : '130vw',
        bottom: device === 'mobile' ? '180px' : '0vh',
        width: device === 'mobile' ? '25vw' : '70px',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '210vw' : '170vw',
        bottom: device === 'mobile' ? '-15px' : '0vh',
        width: device === 'mobile' ? '38vw' : '120px',
        outDir: 'bottom',
      },

      mailbox: {
        left: device === 'mobile' ? '195vw' : '280vw',
        bottom: device === 'mobile' ? '150px' : '0vh',
        width: device === 'mobile' ? '35vw' : '150px',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '55vw' : '30vw',
      },
    },
  };
};
