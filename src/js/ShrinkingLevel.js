import '../css/ShrinkingLevel.css';

export default class ShrinkingLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5,6];
    this.shipSpeed = 3000;
    this.launchFrequency = 2500;
  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  destroyShipAction(ship) {
    this.game.destroyShip(ship, true);
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