import '../css/Level2.css';

export default class Level2 {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5,6];
    this.shipSpeed = 2800;
    this.launchFrequency = 3000;
  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    this.game.destroyShip(ship, true);
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