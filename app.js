import { KNNImageClassifier } from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';

// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const predictionThreshold = 0.98;

let poseSequenceOne = ['poseOne', 'poseTwo'];
let poseSequenceTwo = ['poseOne', 'poseTwo'];
let poseSequenceThree = ['poseOne', 'poseTwo'];
let poseSequenceFour = ['poseOne', 'poseTwo'];

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

    this.startWebcam();
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
}

let main = null;

window.addEventListener('load', () => {
  const ua = navigator.userAgent.toLocaleLowerCase();

  if (!(ua.indexOf('chrome') != -1 || ua.indexOf('firefox') != -1)) {
    alert('Please visit in the latest Chrome or Firefox');
    return;
  }

  main = new Main();
});
