import '../css/GraphLevel.css';

export default class GraphLevel {
  constructor(className) {
    document.body.classList = [className];
    this.wordsPerLengthInWave = 4;
    this.wordLengths = [6,7];
    this.shipSpeed = 10000;
    this.launchFrequency = 500;

    // add new elements to the DOM here (e.g. gun turret)

  }

  
  // these are called by Game.js within the 'keydown' event handler:

  firstFocusAction(ship) {
    // when the key pressed is the first letter of a word
    // used to extend and aim the turret in TurretLevel
    // used to add 'slowed' class to ships in HorizontalLevel

  }

  maintainFocusAction(ship) {
    // when the key pressed still matches an already-focused word
    // used to make turret 'follow' the target in TurretLevel

  }

  async destroyShipAction(ship) {
    // when the player has completed a word
    // used to display the score gained for each defeated word in ShrinkingLevel

    
    this.game.destroyShip(ship, true); // this needs to happen for the level to progress, maybe should be in the Game.js file
  }

  loseFocusAction(ship) {
    // when word was focused, but newly-pressed key does not match
    // used to remove 'slowed' class from ships in HorizontalLevel

  }

  loseAllTargetsAction() {
    // when word(s) were focused, but newly-pressed key has resulted in empty game.targetedWords
    // used to make turret barrel retract in TurretLevel

  }


  // this is called within each ship's 'animationend' event handler:

  detonateShipAction(ship) {
    // when a ship has completed its animation (player didn't type in time)
    // used to make background flash on missed word in ShrinkingLevel

  }

  
  // these are called within game.launchWordShip():

  placeWordShip() {
    // overwritten by any values for ship.style.left or ship.style.top set in wordShipLaunchAction
    let shipPositionX = '0';
    let shipPositionY = '0';
    return {
      x: shipPositionX,
      y: shipPositionY,
    };
  }

  wordShipLaunchAction(ship) {
    // runs every time a word is launched
    // used to create 1 alien element per dolphin in DolphinLevel

  }

}