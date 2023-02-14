import '../css/QuickDrawLevel.css';
import { randomInt, pause } from './util.js';

const importAll = require =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("../media/quickdraw/", true, /\.(png|jpe?g|svg)$/)
);


export default class QuickDrawLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 2;
    this.wordLengths = [8];
    this.shipSpeed = 3000;
    this.launchFrequency = 5000;
    this.images = images;

    this.enemies = [
      'eyeballman',
      'wheelbro',
      'fishchef',
      'dedede',
      'metaknight'
    ];
    
    console.log('images', this.images);
    this.kirbyElement = document.createElement('div');
    this.kirbyElement.id = 'kirby';
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/waiting.png']})`;
    this.enemyElement = document.createElement('div');
    this.randomEnemy = this.enemies[randomInt(0, this.enemies.length - 1)];
    this.enemyElement.style.backgroundImage = `url(${this.images[this.randomEnemy + '/waiting.png']})`;
    this.enemyElement.classList.add('enemy');
    this.enemyElement.id = this.randomEnemy;

    document.querySelector('main').append(this.kirbyElement);
    document.querySelector('main').append(this.enemyElement);
  }

  firstFocusAction(ship) {
    // this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/drawing.png']})`;
    //
  }

  maintainFocusAction(ship) {
    //
  }

  detonateShipAction(ship) {
    
  }

  async destroyShipAction(ship) {
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/drawing.png']})`;
    await pause(50);
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/attacking.png']})`;
    this.enemyElement.style.backgroundImage = `url(${this.images[this.randomEnemy + '/defeated.png']})`;
    this.enemyElement.classList.add('dying');
    this.game.destroyShip(ship, true);
  }

  loseFocusAction(ship) {
    // this.kirbyElement.style.backgroundImage = `url(${kirbyWaiting})`;
  }

  placeWordShip() {
    let shipPositionX = '65%';
    let shipPositionY = '30%';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

}