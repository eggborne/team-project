import '../css/DolphinLevel.css';
import { randomInt, pause } from './util.js';

export default class DolphinLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 3;
    this.wordLengths = [5,6,7];
    this.shipSpeed = 7200;
    this.launchFrequency = 1800;
  }

  wordShipLaunchAction(ship) {
    ship.alienElement = document.createElement('div');
    ship.alienElement.classList.add('alien');
    ship.alienElement.style.top = ship.element.style.top;
    ship.alienElement.style.right = (randomInt(0, 30) * 0.15) + 'rem';
    document.querySelector('main').append(ship.alienElement);
    setTimeout(() => {
      ship.alienElement.classList.add('showing');
    }, 10);
  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    ship.element.classList.add('firing');
    await pause(300);
    ship.alienElement.classList.add('dying');
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    
  }

  placeWordShip() {
    let shipPositionX = '-18rem';
    let shipPositionY = randomInt(window.innerHeight * 0.2, window.innerHeight * 0.75) + 'px';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

}