import '../css/style.css';
import WordAPI from './WordApi';
import WordShip from './WordShip';
import { pause, randomInt, angleOfPointABFromXY, radToDeg } from './util.js';
import TurretLevel from './TurretLevel.js';
import Level2 from './Level2.js';
import DolphinLevel from './DolphinLevel.js';

export default class Game {
  constructor(levelObject) {
    this.wordApi = new WordAPI();
    this.playerInput = '';
    this.score = 0;
    this.destroyedThisWave = 0;
    this.health = 100;
    this.level = 1;
    this.dictionary = {};
    this.activeWordShips = [];
    this.targetedWordShips = [];
    this.usedWords = [];
    this.turretAngle = 0;
    this.interval;

    this.levels = [
      undefined,
      () => new DolphinLevel('dolphin-level'),
      () => new Level2('level2'),
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
      await this.loadLevel(this.level);
      this.startLevelSequence();
    });

    document.getElementById('next-level-button').addEventListener('click', async () => {
      await this.startNewLevel(this.level + 1);
    });

    document.getElementById('restart-button').addEventListener('click', async () => {
      this.resetGame();
      await this.startNewLevel(1);
    });

    document.addEventListener('keydown', async (e) => {
      if ('abcdefghijklmnopqrstuvwxyz'.includes(e.key) && this.activeWordShips.length) {
        this.playerInput += e.key;

        if (this.targetedWordShips.length === 0) {
          for (const ship of this.activeWordShips) {
            let matches = this.matchesSoFar(ship.word);
            if (matches) {
              this.targetedWordShips.push(ship);
              ship.element.classList.add('targeted');
              ship.focusLayer.innerText = this.playerInput;
              this.levelData[this.level].firstFocusAction(ship);
            }
          }
        } else { // one or more is targeted
          for (const ship of this.targetedWordShips) {
            let matches = this.matchesSoFar(ship.word);
            if (matches) {
              ship.focusLayer.innerText = this.playerInput;
              document.getElementById('input-display').innerText = this.playerInput;
              this.levelData[this.level].maintainFocusAction(ship);
              if (this.playerInput.length === ship.word.length) {
                document.getElementById('input-display').classList.add('correct');
                this.deleteShip(ship);
                await this.levelData[this.level].destroyShipAction(ship); 
                if (ship.lastInWave && this.dictionaryEmpty()) {
                  this.displayLevelClearModal();
                } else {
                  //
                }
              }
            } else { // made a typo
              this.targetedWordShips.splice(this.targetedWordShips.indexOf(ship), 1);
              ship.element.classList.remove('targeted');
              this.levelData[this.level].loseFocusAction(ship);
            }
          }
        }

        if (this.targetedWordShips.length === 0) {
          this.playerInput = '';
          document.getElementById('main-turret').classList.remove('aiming');
        }
        document.getElementById('input-display').innerText = this.playerInput;
      } else if (e.code === 'Space' || e.key === ' ') {
        if (!document.getElementById('start-button').classList.contains('hidden')) {
          document.getElementById('start-button').click();
        } else if (!document.getElementById('next-level-button').classList.contains('hidden')) {
          document.getElementById('next-level-button').click();
        }
      }
    });
  }

  async loadLevel(level) {
    let newLevelData = this.levels[level]();
    newLevelData.game = this;
    this.levelData[level] = newLevelData;
    let possibleWordLengths = this.levelData[level].wordLengths;
    let wordPoolSize = 200;
    for (let i = 0; i < possibleWordLengths.length; i++) {
      await this.fillDictionary(possibleWordLengths[i], wordPoolSize);
    }
  }

  async fillDictionary(wordLength, max) {
    let response = await this.wordApi.getWords(wordLength, max);
    this.addUnusedWordsToDictionary(response, wordLength);
  }

  addUnusedWordsToDictionary(response, wordLength) {
    let finalWordsArray = response.filter(word => {
      let alpha = true;
      let used = this.usedWords.includes(word);
      for (const letter of word) {
        if (!'abcdefghijklmnopqrstuvwxyz'.includes(letter)) {
          alpha = false;
        }
      }
      return !used && alpha;
    });
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

  getPercentageDone() {
    let totalWordsInRound = this.levelData[this.level].wordsPerLengthInWave * this.levelData[this.level].wordLengths.length;
    let totalWordsLeft = 0;
    for (const wordLength in this.dictionary) {
      totalWordsLeft += this.dictionary[wordLength].length;
    }
    return Math.floor(100 - ((totalWordsLeft / totalWordsInRound) * 100));
  }

  deleteShip(ship) {
    this.targetedWordShips.splice(this.targetedWordShips.indexOf(ship), 1);
    this.activeWordShips.splice(this.activeWordShips.indexOf(ship), 1);
    document.getElementById('input-display').innerText = this.playerInput;
    document.getElementById('input-display').classList.add('correct');
  }

  async destroyShip(ship, creditPlayer) {
    if (creditPlayer) {
      this.destroyedThisWave++;
      this.score += ship.word.length * this.level;
      document.getElementById('score-display').innerHTML = `Score: <p>${this.score}</p>`;
      ship.element.classList.add('defeated');
    } else {
      ship.element.classList.add('detonated');
    }
    await pause(300);
    ship.element.parentElement.removeChild(ship.element);
    document.getElementById('input-display').classList.remove('correct');
    // document.getElementById('level-display').innerHTML = `Level ${this.level} <p>${this.getPercentageDone()}%</p>`;
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

  matchesSoFar(targetWord) {
    let playLen = this.playerInput.length;
    if (this.playerInput[playLen - 1] === targetWord[playLen - 1]) {
      return true;
    } else {
      return false;
    }
  }

  launchWordShip() {
    let newWord = this.selectRandomWord();
    let newWordShip = new WordShip(newWord);
    let newShipPosition = this.levelData[this.level].placeWordShip();
    newWordShip.element.style.left = newShipPosition.x;
    newWordShip.element.style.top = newShipPosition.y;
    newWordShip.element.style.setProperty('--descend-speed', this.levelData[this.level].shipSpeed + 'ms');
    this.activeWordShips.push(newWordShip);
    if (this.dictionaryEmpty()) {
      newWordShip.lastInWave = true;
    }
    setTimeout(() => {
      newWordShip.element.classList.remove('obscured');
    }, 10);
    newWordShip.element.addEventListener('animationend', (e) => {
      this.deleteShip(newWordShip);
      this.destroyShip(newWordShip);
      if (this.health - (newWordShip.word.length * 10) > 0) {
        this.health -= newWordShip.word.length * 2;
        document.getElementById('health-bar').style.scale = `${this.health}% 1`;
      } else {
        document.getElementById('health-bar').style.scale = `0 1`;
        this.dictionary = {};
        this.clearWordShips();
        this.displayGameOverModal();
      }
      if (newWordShip.lastInWave) {
        this.displayLevelClearModal();
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
        console.log('removing length', possibleLengths[wordLengthIndex], 'from random choices because empty');
        possibleLengths.splice(wordLengthIndex, 1);
      }
    }
    let randomLength = possibleLengths[randomInt(0, possibleLengths.length - 1)];
    let wordArray = [...this.dictionary[randomLength]];
    let newWord = wordArray[randomInt(0, wordArray.length - 1)];
    this.dictionary[randomLength].splice(this.dictionary[randomLength].indexOf(newWord), 1);
    if (!newWord) {
      console.log('selected undefined newWord with args: possibleLengths, randomLength, wordArray', possibleLengths, randomLength, wordArray);
    }
    return newWord;
  }

  async startNewLevel(newLevel) {
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

