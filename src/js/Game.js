import WordAPI from './WordApi';
import { randomInt, pause } from './util.js';

export default class Game {
  constructor() {
    this.wordAPI = new WordAPI();
    this.dictionary = [];
    
    this.typingTarget;

    document.getElementById('player-input').addEventListener('blur', e => {
      e.target.focus();
    });
    
    document.getElementById('player-input').addEventListener('input', e => {
      console.log(this.playerInput);
      console.log(this.typingTarget);
      let matches = this.inputMatchesSoFar();
      if (matches) {
        document.getElementById('test-area').classList = ['correct'];
      } else {
        document.getElementById('test-area').classList = ['incorrect'];
      }
    });

    document.getElementById('player-input').focus();
  }

  get playerInput() {
    return document.getElementById('player-input').value;
  }

  inputMatchesSoFar() {
    let input = this.playerInput;
    let matches = this.typingTarget.substring(0, input.length) === input;
    return matches;
  }

  async showWord() {
    let sentence = '';
    for (let i = 0; i < 7; i++) {
      let word = await this.wordAPI.getWords(randomInt(3, 7), 20);
      let printWord = word[0];
      if (i === 0) {
        printWord = printWord[0].toUpperCase() + printWord.substring(1, printWord.length);
      }
      sentence += ' ' + printWord;
    }
    sentence = sentence.trim();
    this.typingTarget = sentence + '.';
    document.getElementById('test-area').innerText = sentence + '.';
  }
}