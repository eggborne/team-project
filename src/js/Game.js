import '../css/style.css';
import WordAPI from './WordApi';
import WordShip from './WordShip';
import { pause, randomInt } from './util.js';

import GraphLevel from './GraphLevel.js';
import StreetLevel2 from './StreetLevel2.js';
import DolphinLevel from './DolphinLevel.js';
import ShrinkingLevel from './ShrinkingLevel.js';
import QuickDrawLevel from './QuickDrawLevel.js';
import TurretLevel from './TurretLevel.js';
import SpaceLevel from './SpaceLevel';

export default class Game {
  constructor(levelObject) {
    this.wordApi = new WordAPI();
    this.playerInput = '';
    this.score = 0;
    this.destroyedThisWave = 0;
    this.health = 100;
    this.level = 2;
    this.dictionary = {};
    this.activeWordShips = [];
    this.targetedWordShips = [];
    this.usedWords = [];
    this.turretAngle = 0;
    this.interval;

    this.levels = [
      undefined,
      () => new SpaceLevel('space-level'),
      () => new GraphLevel('graph-level'),
      () => new StreetLevel2('level2'),
      () => new ShrinkingLevel('shrinking-level'),
      () => new QuickDrawLevel('quick-draw-level'),
      () => new DolphinLevel('dolphin-level'),
      () => new TurretLevel('turret-level'),
    ];
    this.levelData = [];

    document.getElementById('start-button').addEventListener('click', async (e) => {
      e.preventDefault();
      e.target.disabled = true; // prevents Enter key 'clicking' it when invisible
      e.target.classList.add('hidden');
      document.getElementById('intro-message').classList.add('hidden');
      document.getElementById('level-display').innerHTML = `Level ${this.level} <p>0%</p>`;
      document.getElementById('score-display').innerHTML = `Score: <p>${this.score}</p>`;
      document.getElementById('score-display').classList.remove('hidden');
      document.getElementById('level-display').classList.remove('hidden');
      document.getElementById('player-input').addEventListener('blur', e => {
        e.target.focus();
      });
      document.getElementById('player-input').focus();
      await this.loadLevel(this.level);
      document.getElementById('player-input').value = '';
      this.startLevelSequence();
    });

    document.getElementById('next-level-button').addEventListener('click', async () => {
      let nextLevel = (this.level + 1) < this.levels.length ? this.level + 1 : 1;
      await this.startNewLevel(nextLevel);
    });

    document.getElementById('restart-button').addEventListener('click', async () => {
      this.resetGame();
      await this.startNewLevel(1);
    });

    document.body.addEventListener('keydown', e => {
      if (!this.activeWordShips.length && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        if (!document.getElementById('start-button').classList.contains('hidden')) {
          document.getElementById('start-button').click();
          document.getElementById('player-input').value = '';
        } else if (!document.getElementById('level-clear-modal').classList.contains('hidden')) {
          document.getElementById('next-level-button').click();
          document.getElementById('player-input').value = '';
        }
      }
    });

    document.getElementById('player-input').addEventListener('input', async e => {
      if (this.activeWordShips.length) {
        if (this.targetedWordShips.length === 0) {
          for (const ship of this.activeWordShips) {
            let matches = this.inputMatchesSoFar(ship.word);
            if (matches) {
              this.targetedWordShips.push(ship);
              ship.element.classList.add('targeted');
              ship.focusLayer.innerText = this.playerInputValue;
              this.levelData[this.level].firstFocusAction(ship);
            }
          }
        } else {  // one or more is already targeted
          for (const ship of this.targetedWordShips) {
            let matches = this.inputMatchesSoFar(ship.word);
            if (matches) {
              // continue targeting it or destroy if fully matched
              ship.focusLayer.innerText = this.playerInputValue;
              if (this.playerInputValue.length === ship.word.length) {
                this.deleteShip(ship);
                this.levelData[this.level].destroyShipAction(ship);
              } else {
                this.levelData[this.level].maintainFocusAction(ship);
              }
            } else {
              // un-target it
              this.targetedWordShips.splice(this.targetedWordShips.indexOf(ship), 1);
              ship.element.classList.remove('targeted');
              this.levelData[this.level].loseFocusAction(ship);
            }
          }
        }
        if (this.targetedWordShips.length === 0) {
          if (this.playerInputValue) {
            this.levelData[this.level].loseAllTargetsAction();
            document.getElementById('player-input').value = '';
          }
        }
      }
    });
  }

  inputMatchesSoFar(target) {
    let input = this.playerInputValue;
    let matches = target.substring(0, input.length) === input;
    return matches;
  }

  get playerInputValue() {
    return document.getElementById('player-input').value;
  }

  startLevelSequence() {
    this.launchWordShip();
    this.interval = setInterval(() => {
      if (!this.dictionaryEmpty()) {
        this.launchWordShip();
      } else {
        clearInterval(this.interval);
      }
    }, this.levelData[this.level].launchFrequency);
  }

  async loadLevel(level) {
    console.warn('Loading level', level);
    document.querySelector('main').innerHTML = '';
    let newLevelData = this.levels[level]();
    newLevelData.game = this;
    this.levelData[level] = newLevelData;
    
    if (!this.levelData[level].detonateShipAction) {
      this.levelData[level].detonateShipAction = () => { null; };
    }
    if (!this.levelData[level].loseAllTargetsAction) {
      this.levelData[level].loseAllTargetsAction = () => { null; };
    }
    if (!this.levelData[level].wordShipLaunchAction) {
      this.levelData[level].wordShipLaunchAction = () => { null; };
    }
    let possibleWordLengths = this.levelData[level].wordLengths;
    let finalAmount = this.levelData[level].wordsPerLengthInWave;
    for (let i = 0; i < possibleWordLengths.length; i++) {
      await this.fillDictionary(possibleWordLengths[i], finalAmount);
    }
  }

  async fillDictionary(wordLength, finalAmount) {
    let response = await this.wordApi.getWords(wordLength, finalAmount);
    this.addUnusedWordsToDictionary(response, wordLength, finalAmount);
  }

  addUnusedWordsToDictionary(response, wordLength, finalAmount) {
    let finalWordsArray = response.filter(word => {
      let alpha = true;
      let used = this.usedWords.includes(word);
      let profane = word === 'bastard' || word === 'bitch' || word === 'orgasm';
      for (const letter of word) {
        if (!'abcdefghijklmnopqrstuvwxyz'.includes(letter)) {
          alpha = false;
        }
      }
      return !used && alpha && !profane;
    });
    if (finalWordsArray.length >= finalAmount) {
      console.log('reducing pool array', [...finalWordsArray]);
      finalWordsArray = finalWordsArray.sort(() => .5 - Math.random()).slice(0, finalAmount);
      console.log('now is', finalWordsArray);
    } else {
      console.log('finalWordsArray not long enough!', finalWordsArray);
    }
    this.dictionary[wordLength] = finalWordsArray;
    this.usedWords.push(...finalWordsArray);
  }

  resetGame() {
    this.playerInput = '';
    this.score = 0;
    this.destroyedThisWave = 0;
    this.health = 100;
    this.level = 1;
    this.dictionary = {};
    this.activeWordShips = [];
    this.targetedWordShips = [];
    document.getElementById('health-bar').style.scale = 1;
  }

  getPercentageDone() {
    let totalWordsInRound = this.levelData[this.level].wordsPerLengthInWave * this.levelData[this.level].wordLengths.length;
    let totalWordsLeft = 0;
    for (const wordLength in this.dictionary) {
      totalWordsLeft += this.dictionary[wordLength].length;
    }
    totalWordsLeft += this.activeWordShips.length;
    return Math.floor(100 - ((totalWordsLeft / totalWordsInRound) * 100));
  }

  deleteShip(ship) {
    this.targetedWordShips.splice(this.targetedWordShips.indexOf(ship), 1);
    this.activeWordShips.splice(this.activeWordShips.indexOf(ship), 1);
  }

  async destroyShip(ship, creditPlayer) {
    if (creditPlayer) {
      this.destroyedThisWave++;
      this.score += ship.word.length * this.level;
      document.getElementById('score-display').innerHTML = `Score: <p>${this.score}</p>`;
      ship.element.classList.add('defeated');
      if (!this.activeWordShips.length && this.dictionaryEmpty()) {
        pause(1200).then(() => {
          
          this.displayLevelClearModal();
        });
      }
    } else {
      ship.element.classList.add('detonated');
      if (this.targetedWordShips.length === 0) {
        document.getElementById('player-input').value = '';
      }
    }
    await pause(300);
    ship.element.parentElement.removeChild(ship.element);
    document.getElementById('level-display').innerHTML = `Level ${this.level} <p>${this.getPercentageDone()}%</p>`;
  }

  dictionaryEmpty() {
    let empty = true;
    for (const wordLength in this.dictionary) {
      if (this.dictionary[wordLength].length) {
        empty = false;
      }
    }
    return empty;
  }

  launchWordShip() {
    let newWord = this.selectRandomWord();
    let newWordShip = new WordShip(newWord);
    let newShipPosition = this.levelData[this.level].placeWordShip();
    if (newShipPosition) {
      newWordShip.element.style.left = newShipPosition.x;
      newWordShip.element.style.top = newShipPosition.y;
    }
    newWordShip.element.style.setProperty('--descend-speed', this.levelData[this.level].shipSpeed + 'ms');
    this.levelData[this.level].wordShipLaunchAction(newWordShip);
    this.activeWordShips.push(newWordShip);
    if (this.dictionaryEmpty()) {
      newWordShip.lastInWave = true;
    }
    setTimeout(() => {
      newWordShip.element.classList.remove('obscured');
    }, 10);
    newWordShip.element.addEventListener('animationend', (e) => {
      this.levelData[this.level].detonateShipAction(newWordShip);
      this.deleteShip(newWordShip);
      this.destroyShip(newWordShip);
      if (this.health - (newWordShip.word.length * 1) > 0) {
        this.health -= newWordShip.word.length * 1;
        document.getElementById('health-bar').style.scale = `${this.health}% 1`;
      } else {
        document.getElementById('health-bar').style.scale = `0 1`;
        this.dictionary = {};
        this.clearWordShips();
        this.displayGameOverModal();
      }
      if (newWordShip.lastInWave) {
        pause(1000).then(() => {
          this.displayLevelClearModal();
        });
      }
    });
  }

  clearWordShips() {
    [...document.getElementsByClassName('word-ship')].forEach(shipElement => {
      shipElement.parentElement.removeChild(shipElement);
    });
  }

  selectRandomWord() {
    let possibleLengths = [...this.levelData[this.level].wordLengths];
    for (const wordLengthIndex in possibleLengths) {
      if (this.dictionary[possibleLengths[wordLengthIndex]].length === 0) {
        possibleLengths.splice(wordLengthIndex, 1);
      }
    }
    let randomLength = possibleLengths[randomInt(0, possibleLengths.length - 1)];
    let wordArray = [...this.dictionary[randomLength]];
    let newWord = wordArray[randomInt(0, wordArray.length - 1)];
    this.dictionary[randomLength].splice(this.dictionary[randomLength].indexOf(newWord), 1);
    if (!newWord) {
      newWord = "undefined";
      console.log('selected undefined newWord with args: possibleLengths, randomLength, wordArray', possibleLengths, randomLength, wordArray);
    }
    return newWord;
  }

  async startNewLevel(newLevel) {
    document.getElementById("next-level-button").classList.add('hidden');
    [...document.getElementsByClassName('modal')].forEach(modal => modal.classList.remove('showing'));
    this.level = newLevel;
    document.getElementById('level-display').innerHTML = `Level ${this.level} <p>0%</p>`;
    this.destroyedThisWave = 0;
    await this.loadLevel(this.level);
    this.startLevelSequence();
  }

  displayLevelClearModal() {
    document.getElementById("level-clear-modal").classList.add("showing");
    document.querySelector("#level-clear-modal > .modal-message").innerText = `Level ${this.level} cleared!`;
    let totalWordsInRound = this.levelData[this.level].wordsPerLengthInWave * this.levelData[this.level].wordLengths.length;
    document.querySelector("#level-clear-modal > .modal-details").innerText = `${this.destroyedThisWave}/${totalWordsInRound} words defeated`;
    document.getElementById("next-level-button").classList.remove('hidden');
    document.getElementById("next-level-button").innerText = `Start Level ${this.level + 1}`;  // calls startNewLevel
  }
  displayGameOverModal() {
    document.getElementById("game-over-modal").classList.add("showing");
    document.querySelector("#game-over-modal > .modal-message").innerText = `GAME OVER`;
    document.getElementById("restart-button").innerText = `Restart`;
  }

}

// loadLevel
// calls fillDictionary
// calls addUnusedWordsToDictionary

