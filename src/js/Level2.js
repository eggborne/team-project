import '../css/Level2.css';

import {
  pause,
  radToDeg,
  angleOfPointABFromXY,
} from './util.js';

export default class Level2 {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5, 6];
    this.shipSpeed = 2800;
    this.launchFrequency = 3000;
    document.getElementById('main-turret').style.display = 'flex';
  }

  firstFocusAction(ship) {
    document.getElementById('main-turret').classList.add('aiming');
    this.aimTurret(ship);
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
    ship.focusLayer.classList.add('doomed');
    this.aimTurret(undefined, 0);
    ship.focusLayer.classList.remove('doomed');
  }

  placeWordShip() {
    let shipPositionX = '50%';
    let shipPositionY = '50%';
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
      console.log('aiming from', turretPosition, 'to', targetPosition);
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
    let pointBlank = false;
    bullet.classList.add('bullet');
    document.querySelector('main').append(bullet);
    let targetElement = targetShip.element;
    let turretPosition = {
      x: turretElement.offsetLeft,
      y: turretElement.offsetTop + (turretElement.offsetHeight / 2),
    };
    let targetPosition = {
      x: targetElement.offsetLeft + (targetShip.width / 2),
      y: targetElement.offsetTop + (targetElement.offsetHeight),
    };
    bullet.style.rotate = `${this.turretAngle}deg`;
    bullet.style.left = (turretPosition.x - (bullet.offsetWidth / 2)) + 'px';
    bullet.style.top = (turretPosition.y - (bullet.offsetHeight / 2)) + 'px';
    let moveXAmount = targetPosition.x - turretPosition.x;
    let moveYAmount = targetPosition.y - turretPosition.y;
    bullet.style.translate = `${moveXAmount}px ${moveYAmount}px`;
    if (Math.abs(moveYAmount) < window.innerHeight / 2) {
      console.log('closer bullet moves faster!');
      bullet.style.transitionDuration = '300ms';
      pointBlank = true;
    }
    bullet.addEventListener('transitionend', (e) => {
      e.target.parentElement.removeChild(e.target);
    });
    return pointBlank ? 300 : 600;
  }

}