``` mermaid
flowchart TB

  subgraph index.js
    index(make game obj from Game.js)
  end

  %%GAME OBJ%%
    Game((Game.js))
  
  subgraph OnClick
      direction TB
      g1(start button onclick) -->        
      g2("call LOAD LEVEL()") -->
      g3("call START LEVEL SEQUENCE()")
  end
  subgraph nextLevelOnClick
      direction TB
      g01("check if next level exist") -->        
      g02("START NEW LEVEL()")
  end
  subgraph resetOnClick
      direction TB
      g11("RESET GAME()") -->        
      g12("START NEW Level(1)")
  end
  subgraph loadLevel
      direction TB
      ga0("call instance of level <br> push Game into level") -->
      ga2("call FILL DICTIONARY()")
  end
  subgraph startLevelSequence
      direction TB
      gb1("call LAUNCH WORD SHIP()") -->
      gb2("setInterval func repeats every Nms")
  end
  subgraph launchWordShip
      direction TB
      gbb1("SELECT RANDOM WORD()") -->
      gbb2("new WORDSHIP") -->
      gbb3("get ship location and speed from <br> level. PLACE WORD SHIP()") -->
      gbb4("show ship<br>start descent") -->
      gbb5("DELETE SHIP()") -->
      gbb6("user DESTROY SHIP()")
  end
  subgraph fillDictionary
      direction TB
      gc1("GET WORDS()")
      gc2("truncate word list") -->
      gc3("addUnusedWordsToDictionary()")
  end
  subgraph deleteShip
      direction TB
      gcc1("splice ship from targeted <br> and active arrays")
  end
  subgraph destroyShip
      direction TB
      gccc1("add score for hitting <br> log score to DOM") -->
      gccc2("animation cued<br>if no more ships level clear modal") -->
      gccc3("clear ship from DOM<br>GET PERCENTAGE DONE()")
  end
  subgraph addUnusedWordsToDictionary
      direction TB
      gd1("filter for A-Z, and not used before") -->
      gd2("add to dictionary and used array")
  end
  subgraph selectRandomWord
      direction TB
      ge1("check dictionary for words length N") -->
      ge2("grab random word and rm from dict")
      ge3("check for undefined word")
  end
  subgraph getPercentageDone
      direction TB
      gf1("count total words defined and words left") -->
      gf2("divide to get doneness")
  end
  subgraph startNewLevel
      direction TB
      gg1("remove modal<br>reset level stats") -->
      gg2("LOAD LEVEL()") -->
      gg3("START LEVEL SEQUENCE()")
  end
  subgraph resetGame
      direction TB
      gh1("reset all class properties <br> and healthbar")
  end

  subgraph WORDSHIP
    direction TB
    ws1("create the word ship <br> by inserting random word into div")
  end
  
  subgraph Level
    direction TB
    level1("placeWordShip()")
  end
  
    subgraph getWords
      w1("fetchAPI for word length N") -->
      w2("filterWordList()")
    end
    
    subgraph filterWordList
      wa1("get random selection of<br>the most common words returned")
    end

  index --> Game
  Game --> OnClick
  Game --> nextLevelOnClick
  Game --> resetOnClick

  resetOnClick --> resetGame
  resetOnClick --> startNewLevel
  OnClick --> loadLevel
  OnClick --> startLevelSequence
  
  startNewLevel --> loadLevel
  startNewLevel --> startLevelSequence
  nextLevelOnClick --> startNewLevel
  loadLevel --> fillDictionary
  fillDictionary --> getWords
  getWords --> filterWordList
  fillDictionary --> addUnusedWordsToDictionary
  startLevelSequence --> launchWordShip
  launchWordShip --> Level
  launchWordShip --> selectRandomWord
  launchWordShip --> WORDSHIP
  launchWordShip --> deleteShip
  launchWordShip --> destroyShip
  destroyShip --> getPercentageDone


  %% Class Colors %%
  Level:::blue
  index.js:::orange
  WORDSHIP:::yellow
  getWords:::purple
  filterWordList:::purple

  %% Game Attributes %%
  Game:::medium
  Game:::foreignObject
    %% color Attributes
  Game:::pink
  OnClick:::tropical
  nextLevelOnClick:::tropical
  resetOnClick:::tropical
  startNewLevel:::tropical
  selectRandomWord:::tropical
  startLevelSequence:::tropical
  deleteShip:::tropical
  loadLevel:::tropical
  fillDictionary:::tropical
  addUnusedWordsToDictionary:::tropical
  launchWordShip:::tropical
  destroyShip:::tropical
  getPercentageDone:::tropical
  resetGame:::tropical

  %% Colors %%

  classDef tropical fill:#C6EDC3,stroke:#000,stroke-width:2px,font-size:1.5rem,color:black
  classDef blue fill:#131761,stroke:#000,stroke-width:2px,font-size:1.5rem,color:#fff
  classDef orange fill:#ECA762,stroke:#000,stroke-width:2px,color:black,font-size:1.5rem
  classDef red fill:#FF303B,stroke:#000,stroke-width:2px,color:#fff
  classDef green fill:#027F55,stroke:#000,stroke-width:2px,color:#fff
  classDef pink fill:#E17A9B,stroke:#333,stroke-width:5px,font-size:1rem,font-weight:700,color:black
  classDef forestGreen fill:#027F55,stroke:#333,stroke-width:2px,font-size:3rem,font-weight:700
  classDef yellow fill:#FDF046,stroke:#333,stroke-width:2px,font-size:1.5rem,font-weight:700,color:black
  classDef purple fill:#D183FD,stroke:#333,stroke-width:2px,font-size:1.5rem,font-weight:700,color:black

  %% Sizes %%

  classDef medium r:120
```
  
