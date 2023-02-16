import '../css/TurretLevel.css';
import {
  pause,
  radToDeg,
  angleOfPointABFromXY,
  randomInt,
} from './util.js';

export default class TurretLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5];
    this.shipSpeed = 5000;
    this.launchFrequency = 2000;

    this.turretElement = document.createElement('div');
    this.turretElement.classList.add('turret');
    this.turretElement.id = 'main-turret';
    this.turretElement.innerHTML = `
      <div class="turret-barrel"></div>   
    `;
    document.querySelector('main').prepend(this.turretElement);
  }

  firstFocusAction(ship) {
    document.getElementById('main-turret').classList.add('aiming');
    this.aimTurret(ship);
    // ship.element.style.setProperty('--descend-speed', (this.levelData[this.level].shipSpeed) + 'ms');
  }

  maintainFocusAction(ship) {
    this.aimTurret(ship);
  }

  async destroyShipAction(ship) {
    ship.element.classList.add('frozen');
    let flySpeed = this.fireBullet(ship);
    await pause(flySpeed);
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    this.aimTurret(undefined, 0);
  }

  async loseAllTargetsAction(ship) {
    await pause(300);
    console.log('targ', this.game.targetWordShips);
    if (this.game.targetedWordShips.length === 0) {
      document.getElementById('main-turret').classList.remove('aiming');
    }
  }

  placeWordShip() {
    let shipPositionX = randomInt(0, (window.innerWidth - this.width)) + 'px';
    let shipPositionY = 0;
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

  aimTurret(targetShip, forceAngle) {
    let turretElement = document.getElementById('main-turret');
    let newAngle;
    if (forceAngle !== undefined) {
      newAngle = forceAngle;
    } else {
      let targetElement = targetShip.element;
      let turretPosition = {
        x: turretElement.offsetLeft,
        y: turretElement.offsetTop,
      };
      let targetPosition = {
        x: targetElement.offsetLeft + (targetShip.width / 2),
        y: targetElement.offsetTop,
      };
      newAngle = radToDeg(angleOfPointABFromXY(
        targetPosition.x,
        targetPosition.y,
        turretPosition.x,
        turretPosition.y
      ));
    }
    turretElement.style.rotate = `${newAngle}deg`;
    this.turretAngle = newAngle;
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