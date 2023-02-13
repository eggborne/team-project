import '../css/Level1Data.css';

export default class Level1Data {
  constructor(className) {
    document.querySelector('main').classList = [className];
    this.levelData = {
      wordsPerLengthInWave: 5,
      wordLengths: [5],
      shipSpeed: 5000,
      launchFrequency: 1000,
    };
  }
}