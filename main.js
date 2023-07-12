let y = 0; //scrollY
let prevScrollHight = 0; // 前のsecneたちのscrollHeightの合計
let currentScene = 0; // 今のscene
let newScene = false;

const sceneInfo = [
  //0
  {
    type: 'sticky',
    heightNum: 2,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll--section__0'),
      title: document.querySelector('.title'),
    },
    values: {
      titleOpacity_in: [0.15, 1, { start: 0, end: 0.2 }],
      titleMatrix: [1, 110, { start: 0.3, end: 1 }],
    },
  },
  //1
  {
    type: 'sticky',
    heightNum: 4,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll--section__1'),
      messageA: document.querySelector('#scroll--section__1 .main--message.a'),
      messageB: document.querySelector('#scroll--section__1 .main--message.b'),
      canvas: document.querySelector('#video--canvas'),
      context: document.querySelector('#video--canvas').getContext('2d'),
      videoImages: [],
    },
    values: {
      videoImagesCount: 200,
      imagesSequence: [0, 199],
      canvasScale: [1.1, 0.6, { start: 0, end: 0.9 }],
      canvasOpacity: [1, 0, { start: 0.85, end: 0.95 }],
      titleOpacity_out: [1, 0, { start: 0.05, end: 0.1 }],
      messageA_Opacity_in: [0, 1, { start: 0, end: 0.15 }],
      messageA_Opacity_out: [1, 0, { start: 0.25, end: 0.4 }],
      messageA_Matrix_in: [1, 1.2, { start: 0, end: 0.4 }],
      messageB_Opacity_in: [0, 1, { start: 0.5, end: 0.65 }],
      messageB_Opacity_out: [1, 0, { start: 0.75, end: 0.9 }],
      messageB_Matrix_in: [1, 1.2, { start: 0.5, end: 0.9 }],
    },
  },
  //2
  {
    type: 'normal',
    // heightNum: 4,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('.contents'),
    },
  },
];

function setCanvasImages() {
  let imgElem;
  for (let i = 0; i < sceneInfo[1].values.videoImagesCount; i++) {
    imgElem = document.createElement('img');
    imgElem.src = `./chocolate/chocolate_${1 + i}.jpg`;
    sceneInfo[1].objs.videoImages.push(imgElem);
  }
}

function setLayout() {
  sceneInfo.map(scene => {
    if (scene.type === 'sticky') {
      scene.scrollHeight = scene.heightNum * innerHeight;
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    } else if (scene.type === 'normal') {
      scene.scrollHeight = `${scene.objs.container.offsetHeight}px`;
    }
  });

  y = scrollY;
  let totalScrollHeight = 0;
  for (const [i, scene] of sceneInfo.entries()) {
    totalScrollHeight += scene.scrollHeight;
    if (totalScrollHeight >= y) {
      currentScene = i;
      break;
    }
  }
  document.body.setAttribute('id', `show--scene__${currentScene}`);

  // const heightRatio = innerHeight / 1080;
  // sceneInfo[1].objs.canvas.style.transform = `translate3d(-50% , -50%, 0) scale(${heightRatio})`;
  // const widthRatio = innerWidth / 1920;
  // sceneInfo[1].objs.canvas.style.transform = `translate3d(-50% , -50%, 0) scale(${widthRatio})`;
}

function calcValues(values, currentY) {
  let rv;
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  let scrollRatio = currentY / scrollHeight;
  if (values.length === 3) {
    const partScrollStart = values[2].start * scrollHeight;
    const partScrollEnd = values[2].end * scrollHeight;
    const partScrollHeight = partScrollEnd - partScrollStart;

    if (currentY >= partScrollStart && currentY <= partScrollEnd) {
      const progress = (currentY - partScrollStart) / partScrollHeight;
      if (values[1] === 110) {
        rv = easeInOutExpo(progress) * (values[1] - values[0]) + values[0];
      } else {
        rv = progress * (values[1] - values[0]) + values[0];
      }
    } else if (currentY < partScrollStart) {
      rv = values[0];
    } else if (currentY > partScrollEnd) {
      rv = values[1];
    }
  } else {
    rv = scrollRatio * (values[1] - values[0]) + values[0];
  }
  return rv;
}

//加速
function easeInOutExpo(progress) {
  return progress === 0
    ? 0
    : progress === 1
    ? 1
    : progress < 0.5
    ? 0.5 * Math.pow(2, 25 * (2 * progress - 1))
    : 0.5 * (2 - Math.pow(2, -10 * (2 * progress - 1)));
}

function playAnimation() {
  const objs = sceneInfo[currentScene].objs;
  const values = sceneInfo[currentScene].values;
  const currentY = y - prevScrollHight;
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  let scrollRatio = currentY / scrollHeight;

  switch (currentScene) {
    case 0:
      if (scrollRatio <= 0.25) {
        objs.title.style.opacity = calcValues(values.titleOpacity_in, currentY);
      }
      objs.title.style.transform = `
      matrix(${calcValues(values.titleMatrix, currentY)},0,0,
      ${calcValues(values.titleMatrix, currentY)},0,0)`;
      break;
    case 1:
      let sequence = Math.round(calcValues(values.imagesSequence, currentY));
      objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      if (scrollRatio <= 0.15) {
        sceneInfo[0].objs.title.style.opacity = calcValues(
          values.titleOpacity_out,
          currentY
        );
      }

      if (scrollRatio <= 0.2) {
        objs.messageA.style.opacity = calcValues(
          values.messageA_Opacity_in,
          currentY
        );
      } else {
        objs.messageA.style.opacity = calcValues(
          values.messageA_Opacity_out,
          currentY
        );
      }
      if (scrollRatio <= 0.8) {
        objs.messageB.style.opacity = calcValues(
          values.messageB_Opacity_in,
          currentY
        );
      } else {
        objs.messageB.style.opacity = calcValues(
          values.messageB_Opacity_out,
          currentY
        );
      }
      objs.messageA.style.transform = `
      matrix(${calcValues(values.messageA_Matrix_in, currentY)},0,0,
      ${calcValues(values.messageA_Matrix_in, currentY)},0,0)`;
      objs.messageB.style.transform = `
      matrix(${calcValues(values.messageB_Matrix_in, currentY)},0,0,
      ${calcValues(values.messageB_Matrix_in, currentY)},0,0)`;
      objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${calcValues(
        values.canvasScale,
        currentY
      )})`;
      // if (scrollRatio > values.canvasScale[2].end) {
      // }

      objs.canvas.style.opacity = `${calcValues(
        values.canvasOpacity,
        currentY
      )}`;
      break;
  }
}
function scrollLoop() {
  newScene = false;
  prevScrollHight = 0;
  sceneInfo.forEach((scene, i) => {
    if (i < currentScene) prevScrollHight += scene.scrollHeight;
  });

  if (y > prevScrollHight + sceneInfo[currentScene].scrollHeight) {
    newScene = true;
    currentScene++;
    document.body.setAttribute('id', `show--scene__${currentScene}`);
  }
  if (y < prevScrollHight) {
    newScene = true;
    if (currentScene === 0) return;
    currentScene--;
    document.body.setAttribute('id', `show--scene__${currentScene}`);
  }
  if (newScene) return;
  playAnimation();
}

window.addEventListener('load', () => {
  setTimeout(() => scrollTo(0, 0), 100);
  document.body.classList.remove('before--load');
  setLayout();

  window.addEventListener('scroll', () => {
    y = scrollY;
    scrollLoop();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
      setLayout();
    }
  });

  window.addEventListener('orientationchange', setLayout);

  document.querySelector('.loading').addEventListener('transitonend', e => {
    document.body.removeChild(e.currentTarget);
  });
});
// window.addEventListener('DOMContentLoaded', setLayout)

setCanvasImages();
