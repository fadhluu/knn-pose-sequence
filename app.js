import { KNNImageClassifier } from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';
import { rightPad } from 'deeplearn/dist/util';
import { log } from 'deeplearn';

// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98;

const NUM_SEQUENCE = 4;
const NUM_POSE = 2;

// const poseSequence = {
//   sequenceOne: [{
//     id: 0,
//     name: 'poseOne'
//   }, 'poseTwo'],
//   sequenceTwo: ['poseOne', 'poseTwo'],
//   sequenceThree: ['poseOne', 'poseTwo'],
//   sequenceFour: ['poseOne', 'poseTwo'],
// };

const poseSequence = [
  {
    id: 0,
    name: 'sequenceOnePoseOne',
  },
  {
    id: 1,
    name: 'sequenceOnePoseTwo',
  },
  {
    id: 2,
    name: 'sequenceTwoPoseOne',
  },
  {
    id: 3,
    name: 'sequenceTwoPoseTwo',
  },
  {
    id: 4,
    name: 'sequenceThreePoseOne',
  },
  {
    id: 5,
    name: 'sequenceThreePoseTwo',
  },
  {
    id: 6,
    name: 'sequenceFourPoseOne',
  },
  {
    id: 7,
    name: 'sequenceFourPoseTwo',
  },
];

class Main {
  constructor() {
    this.training = -1;
    this.videoPlaying = false;

    this.previousPrediction = -1;
    this.currentPredictedWords = [];

    this.now = null;
    this.then = Date.now();
    this.startTime = this.then;
    this.fps = 5;
    this.fpsInterval = 1000 / this.fps;
    this.elapsed = 0;

    this.knn = null;

    this.video = document.getElementById('video');

    this.statusText = document.getElementById('status-text');

    this.video.addEventListener('mousedown', () => {
      main.pausePredicting();
    });

    this.initTrainButton();
  }

  startWebcam() {
    // Setup webcam
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;

        this.video.addEventListener(
          'playing',
          () => (this.videoPlaying = true)
        );
        this.video.addEventListener(
          'paused',
          () => (this.videoPlaying = false)
        );
      });
  }

  loadKNN() {
    this.knn = new KNNImageClassifier(NUM_POSE * NUM_SEQUENCE, TOPK);

    // Load knn model
    this.knn.load().then(() => this.startTraining());
  }

  startTraining() {
    this.startWebcam();

    if (this.timer) {
      this.stopTraining();
    }
    var promise = this.video.play();

    if (promise !== undefined) {
      promise
        .then(_ => {
          console.log('Autoplay started');
        })
        .catch(error => {
          console.log('Autoplay prevented');
        });
    }
    this.timer = requestAnimationFrame(this.train.bind(this));
  }

  stopTraining() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  train() {
    if (this.videoPlaying) {
      // Get image data from video element
      const image = dl.fromPixels(this.video);

      // Train class if one of the buttons is held down
      if (this.training != -1) {
        // Add current image to classifier
        console.log(image);
        this.knn.addImage(image, this.training);
      }

      const exampleCount = this.knn.getClassExampleCount();

      if (Math.max(...exampleCount) > 0) {
        for (let i = 0; i < NUM_SEQUENCE * NUM_POSE; i++) {
          if (exampleCount[i] > 0) {
            const button = document.getElementById(
              `example-${poseSequence[i].name}`
            );
            button.innerText = `No Examples: ${exampleCount[i]}`;
          }
        }
      }
    }
    this.timer = requestAnimationFrame(this.train.bind(this));
  }

  initTrainButton() {
    for (let i = 0; i < poseSequence.length; i++) {
      this.createTrainButton(i, poseSequence[i].name);
    }
  }

  createTrainButton(i, btnName) {
    const button = document.getElementById(`${btnName}`);

    button.addEventListener('mousedown', () => {
      this.training = i;
      console.log(i);
    });

    button.addEventListener('mouseup', () => (this.training = -1));
  }
}

let main = null;

window.addEventListener('load', () => {
  const ua = navigator.userAgent.toLocaleLowerCase();

  const btnPredict = document.getElementById('start-predicting');
  const btnTrain = document.getElementById('start-train');

  if (!(ua.indexOf('chrome') != -1 || ua.indexOf('firefox') != -1)) {
    alert('Please visit in the latest Chrome or Firefox');
    return;
  }

  main = new Main();
  btnPredict.addEventListener('click', () => {
    main.startWebcam();
  });
  btnTrain.addEventListener('click', () => {
    main.loadKNN();
  });
});
