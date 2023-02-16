import '../css/Level2.css';

export default class Level2 {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 5;
    this.wordLengths = [5, 6];
    this.shipSpeed = 2800;
    this.launchFrequency = 3000;
    this.flameEmoji1 = document.createElement('div');
    this.flameEmoji1.id = 'flameEmoji01';
    this.flameEmoji1.innerHTML = '&#128293';

    this.flameEmoji2 = document.createElement('div');
    this.flameEmoji2.id = 'flameEmoji02';
    this.flameEmoji2.innerHTML = '&#128293';

    this.flameEmoji3 = document.createElement('div');
    this.flameEmoji3.id = 'flameEmoji03';
    this.flameEmoji3.innerHTML = '&#128293';


    document.querySelector('main').append(this.flameEmoji1, this.flameEmoji2, this.flameEmoji3);

  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  async destroyShipAction(ship) {
    this.flameEmoji1.classList.add('showing');
    this.flameEmoji2.classList.add('showing');
    this.flameEmoji3.classList.add('showing');
    setTimeout(() => {
      this.flameEmoji1.classList.remove('showing');
      this.flameEmoji2.classList.remove('showing');
      this.flameEmoji3.classList.remove('showing');
    }, 500);
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