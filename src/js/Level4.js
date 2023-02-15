import '../css/Level4.css';
import { randomInt } from '../js/util.js';
export default class Level4 {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 6;
    this.wordLengths = [5,6,7];
    this.shipSpeed = 6000;
    this.launchFrequency = 6000;
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