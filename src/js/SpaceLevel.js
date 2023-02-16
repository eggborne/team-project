import '../css/SpaceLevel.css';
import { randomInt } from './util.js';
export default class SpaceLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 6;
    this.wordLengths = [5,6,7];
    this.shipSpeed = 6000;
    this.launchFrequency = 6000;
    this.turretElement = document.createElement('div');
    this.turretElement.classList.add('ship');
    this.turretElement.id = 'defender-ship';

    document.querySelector('main').prepend(this.turretElement);
  }

  firstFocusAction(ship) {

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
    let shipPositionY = randomInt(window.innerHeight * 0.15, window.innerHeight * 0.75) + 'px';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

  fireBullet(targetShip) {
    let turretElement = document.getElementById('main-turret');
    let bullet = document.createElement('div');
    bullet.classList.add('bullet');
    document.querySelector('main').prepend(bullet);
    let targetElement = targetShip.element;
    let turretPosition = {
      x: turretElement.offsetLeft,
      y: turretElement.offsetTop + (turretElement.offsetHeight / 2),
    };
    let targetPosition = {
      x: targetElement.offsetLeft + (targetShip.width / 2),
      y: targetElement.offsetTop + (targetElement.offsetHeight / 2),
    };
    bullet.style.rotate = `${this.turretAngle}deg`;
    bullet.style.left = (turretPosition.x - (bullet.offsetWidth / 2)) + 'px';
    bullet.style.top = (turretPosition.y - (bullet.offsetHeight / 2)) + 'px';
    let moveXAmount = targetPosition.x - turretPosition.x;
    let moveYAmount = targetPosition.y - turretPosition.y;
    bullet.style.translate = `${moveXAmount}px ${moveYAmount}px`;
    bullet.addEventListener('transitionend', (e) => {
      e.target.parentElement.removeChild(e.target);
    });
    return 300;
  }

}