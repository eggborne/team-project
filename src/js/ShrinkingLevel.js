import '../css/ShrinkingLevel.css';
import { pause } from '../js/util.js';

export default class ShrinkingLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5,6];
    this.shipSpeed = 3000;
    this.launchFrequency = 2500;
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.classList.add('score-display');
    document.querySelector('main').append(this.scoreDisplay);
  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  destroyShipAction(ship) {
    this.game.destroyShip(ship, true);
    this.scoreDisplay.style.display = 'block';
    pause(10).then(() => {
      this.scoreDisplay.innerText = `+${ship.word.length * this.game.level}`;
      this.scoreDisplay.classList.add('showing');
      setTimeout(() => {        
        this.scoreDisplay.style.display = 'none';
        this.scoreDisplay.classList.remove('showing');
      }, 1400);
    });
  }

  detonateShipAction(ship) {
    document.querySelector('main').classList.add('damaged');
    setTimeout(() => {
      document.querySelector('main').classList.remove('damaged');
    }, 400);
  }

  loseFocusAction(ship) {
    //
  }

  placeWordShip() {
    let shipPositionX = '50%';
    let shipPositionY = '50%';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

}