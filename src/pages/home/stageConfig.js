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
          left: device === 'mobile' ? '95vw' : '85vw',
          bottom: device === 'mobile' ? '-150px' : '-50vh', // -200px -> -150px
          scale: device === 'mobile' ? 3 : 1.5,
        },
        sec1: {
          left: device === 'mobile' ? '15vw' : '15vw',
          bottom: device === 'mobile' ? '175px' : '20vh', // 125px -> 175px
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
        sec2: {
          left: device === 'mobile' ? '15vw' : '15vw',
          bottom: device === 'mobile' ? '175px' : '20vh', // 125px -> 175px
          scale: device === 'mobile' ? 0.7 : 0.4,
        },
      },
    },

    sky: {
      sun: {
        width: device === 'mobile' ? '30vw' : '10vw',
        baseY: 50,
        amplitude: 40,
        outDir: 'top',
      },
      cloud1: {
        top: device === 'mobile' ? '30vh' : '15vh',
        width: device === 'mobile' ? '40vw' : '15vw',
        opacity: 0.7,
        outDir: 'top',
      },
      cloud2: {
        top: device === 'mobile' ? '20vh' : '10vh',
        width: device === 'mobile' ? '30vw' : '10vw',
        opacity: 0.7,
        outDir: 'top',
      },
    },

    // 🌍 1번 무대
    sec1: {
      tree: {
        left: device === 'mobile' ? '10vw' : '10vw',
        bottom: device === 'mobile' ? '240px' : '12vh', // 190px -> 240px
        width: device === 'mobile' ? '30vw' : '12vw',
        outDir: 'bottom',
      },
      grass1: {
        left: device === 'mobile' ? '40vw' : '20vw',
        bottom: device === 'mobile' ? '240px' : '10vh', // 190px -> 240px
        width: device === 'mobile' ? '20vw' : '8vw',
        outDir: 'bottom',
      },
      grass1_sub: {
        left: device === 'mobile' ? '30vw' : '30vw',
        bottom: device === 'mobile' ? '110px' : '2vh', // 60px -> 110px
        width: device === 'mobile' ? '10vw' : '5vw',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '80vw' : '40vw',
        bottom: device === 'mobile' ? '100px' : '1vh', // 50px -> 100px
        width: device === 'mobile' ? '22vw' : '6vw',
        outDir: 'bottom',
      },

      windmill: {
        left: device === 'mobile' ? '80vw' : '75vw',
        bottom: device === 'mobile' ? '200px' : '20vh', // 150px -> 200px
        width: device === 'mobile' ? '60vw' : '40vw',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '60vw' : '60vw',
      },
    },

    // 🌍 2번 무대
    sec2: {
      tree: {
        left: device === 'mobile' ? '225vw' : '130vw',
        bottom: device === 'mobile' ? '300px' : '15vh', // 250px -> 300px
        width: device === 'mobile' ? '40vw' : '15vw',
        outDir: 'bottom',
      },
      grass2: {
        left: device === 'mobile' ? '175vw' : '110vw',
        bottom: device === 'mobile' ? '150px' : '8vh', // 100px -> 150px
        width: device === 'mobile' ? '13vw' : '6vw',
        outDir: 'bottom',
      },
      grass2_sub: {
        left: device === 'mobile' ? '120vw' : '150vw',
        bottom: device === 'mobile' ? '230px' : '12vh', // 180px -> 230px
        width: device === 'mobile' ? '25vw' : '8vw',
        outDir: 'bottom',
      },
      rock: {
        left: device === 'mobile' ? '210vw' : '170vw',
        bottom: device === 'mobile' ? '35px' : '2vh', // -15px -> 35px
        width: device === 'mobile' ? '38vw' : '7vw',
        outDir: 'bottom',
      },

      mailbox: {
        left: device === 'mobile' ? '195vw' : '180vw',
        bottom: device === 'mobile' ? '200px' : '20vh', // 150px -> 200px
        width: device === 'mobile' ? '35vw' : '20vw',
        zIndex: 10,
        outDir: 'bottom',
        walkToLeft: device === 'mobile' ? '55vw' : '165vw',
      },
    },
  };
};
