import '../css/HorizontalLevel.css';
import { randomInt } from './util.js';
export default class HorizontalLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 6;
    this.wordLengths = [5,6,7];
    this.shipSpeed = 6000;
    this.launchFrequency = 2000;
  }

  firstFocusAction(ship) {
    ship.element.classList.add('slowed');
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    ship.element.classList.remove('slowed');
  }

  placeWordShip() {
    let shipPositionX = '0';
    let shipPositionY = randomInt(window.innerHeight * 0.15, window.innerHeight * 0.85) + 'px';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

}