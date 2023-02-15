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
    this.wordsPerLengthInWave = 1;
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
    
    this.createEnemyElement();

    document.querySelector('main').append(this.kirbyElement);
  }

  createEnemyElement() {
    this.enemyElement = document.createElement('div');
    this.randomEnemy = this.enemies[randomInt(0, this.enemies.length - 1)];
    console.log('creating', this.randomEnemy);
    this.enemyElement.style.backgroundImage = `url(${this.images[this.randomEnemy + '/waiting.png']})`;
    this.enemyElement.classList.add('enemy');
    this.enemyElement.id = this.randomEnemy;
    document.querySelector('main').append(this.enemyElement);
  }

  firstFocusAction(ship) {
    //
  }

  maintainFocusAction(ship) {
    //
  }

  detonateShipAction(ship) {
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/defeated.png']})`;
    this.enemyElement.style.backgroundImage = `url(${this.images[this.randomEnemy + '/attacking.png']})`;
  }

  async destroyShipAction(ship) {
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/drawing.png']})`;
    pause(50).then(() => {
      this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/attacking.png']})`;
    });
    this.enemyElement.style.backgroundImage = `url(${this.images[this.randomEnemy + '/defeated.png']})`;
    this.enemyElement.classList.add('dying');
    this.game.destroyShip(ship, true);
    await pause(1000);
    this.enemyElement.parentElement.removeChild(this.enemyElement);
    this.kirbyElement.style.backgroundImage = `url(${this.images['samuraikirby/waiting.png']})`;
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