import '../css/SpaceLevel.css';
import { randomInt, pause } from './util.js';
export default class SpaceLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 6;
    this.wordLengths = [5,6];
    this.shipSpeed = 6000;
    this.launchFrequency = 2000;
    this.defenderElement = document.createElement('div');
    this.defenderElement.classList.add('ship');
    this.defenderElement.id = 'defender-ship';

    document.querySelector('main').prepend(this.defenderElement);
  }

  firstFocusAction(ship) {
    this.defenderElement.style.top = ship.positionY;
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    this.fireBullet(ship);
    await pause(500);
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    ship.element.classList.remove('slowed');
  }

  wordShipLaunchAction(ship) {
    let shipPositionY = randomInt(window.innerHeight * 0.15, window.innerHeight * 0.75) + 'px';
    ship.element.style.top = shipPositionY;
    ship.element.style.left = 0;
    ship.positionY = shipPositionY;
    // runs every time a word is launched
    // used to create 1 alien element per dolphin in DolphinLevel

  }

  placeWordShip() {
    //
  }

  async fireBullet(targetShip) {
    let shipX = targetShip.element.offsetLeft;
    let shipWidth = targetShip.element.offsetWidth;
    let bullet = document.createElement('div');
    bullet.classList.add('bullet');
    this.defenderElement.append(bullet);
    await pause(10);
    bullet.style.translate = ((window.innerWidth - shipX - (shipWidth * 2.5)) * -1) + 'px -50%';
    bullet.addEventListener('transitionend', (e) => {
      e.target.parentElement.removeChild(e.target);
    });
  }

}