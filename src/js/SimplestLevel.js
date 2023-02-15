import '../css/SimplestLevel.css';

export default class SimplestLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5,6];
    this.shipSpeed = 2800;
    this.launchFrequency = 3000;
  }

  wordShipLaunchAction(ship) {
    //
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

  detonateShipAction(ship) {
    //
  }

  loseFocusAction(ship) {
    //
  }

  loseAllTargetsAction() {
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