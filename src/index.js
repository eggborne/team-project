import './css/style.css';
import Game from './js/Game';
window.addEventListener('load', () => {

  let game = new Game();
  game.showWord();
});

