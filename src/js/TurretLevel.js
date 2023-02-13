import { pause, randomInt } from './util.js';
import '../css/TurretLevel.css';

export default class TurretLevel {
  constructor(className) {
    document.querySelector('main').classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5];
    this.shipSpeed = 5000;
    this.launchFrequency = 2000;
  }

  firstFocusAction(ship) {
    document.getElementById('main-turret').classList.add('aiming');
    this.game.aimTurret(ship);
    // ship.element.style.setProperty('--descend-speed', (this.levelData[this.level].shipSpeed) + 'ms');
  }

  maintainFocusAction(ship) {
    this.game.aimTurret(ship);
  }

  async destroyShipAction(ship) {
    ship.element.classList.add('frozen');
    let flySpeed = this.game.fireBullet(ship);
    await pause(flySpeed);
    await this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    ship.focusLayer.classList.add('doomed');
    this.game.aimTurret(undefined, 0);
    ship.focusLayer.classList.remove('doomed');
  }

}