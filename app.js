import { KNNImageClassifier } from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';
import { rightPad } from 'deeplearn/dist/util';

// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98;

const NUM_SEQUENCE = 4;
const NUM_POSE = 2;

const poseSequence = {
  sequenceOne: ['poseOne', 'poseTwo'],
  sequenceTwo: ['poseOne', 'poseTwo'],
  sequenceThree: ['poseOne', 'poseTwo'],
  sequenceFour: ['poseOne', 'poseTwo'],
};

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

  initTrainButton() {
    for (let i = 0; i < NUM_SEQUENCE; i++) {
      for (let j = 0; j < NUM_POSE; j++) {
        const button = document.getElementById(`btnS${i + 1}P${j + 1}`);
        console.log(button.innerText);
        button.addEventListener('mousedown', () => {
          this.training = { i, j };
        });
      }
    }
  }
}

let main = null;

window.addEventListener('load', () => {
  const ua = navigator.userAgent.toLocaleLowerCase();

  const btnPredict = document.getElementById('start-predicting');

  if (!(ua.indexOf('chrome') != -1 || ua.indexOf('firefox') != -1)) {
    alert('Please visit in the latest Chrome or Firefox');
    return;
  }

  main = new Main();
  btnPredict.addEventListener('click', () => {
    main.startWebcam();
  });
});
