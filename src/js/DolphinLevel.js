import '../css/DolphinLevel.css';
import { randomInt } from './util.js';

export default class DolphinLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 6;
    this.wordLengths = [5,6,7];
    this.shipSpeed = 5000;
    this.launchFrequency = 1000;
  }

  firstFocusAction(ship) {
    //
    ship.element.style.animationDuration = '1000ms';
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    
  }

  placeWordShip() {
    let shipPositionX = '-18rem';
    let shipPositionY = randomInt(window.innerHeight * 0.2, window.innerHeight * 0.8) + 'px';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

}