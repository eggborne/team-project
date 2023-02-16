``` mermaid
flowchart

  subgraph index.js
    index(make game obj from Game.js)
  end

  subgraph Game.js
    direction TB
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
  end

  subgraph WORDSHIP
    direction TB
    ws1('create the word ship <br> by inserting random word into div')
  end
  
  subgraph Level
    direction TB
    level1("placeWordShip()")
  end
  
  subgraph WordAPI
    direction TB
    subgraph getWords
      w1("fetchAPI for word length N") -->
      w2("filterWordList()")
    end
    subgraph filterWordList
      wa1("get random selection of<br>the most common words returned")
    end
  end

  
  OnClick -.- nextLevelOnClick
  index --> Game.js:::pink
  g2 --> loadLevel
  g3 --> startLevelSequence
  ga2 --> fillDictionary
  gc1 --> getWords
  w2 --> wa1
  wa1 --> gc2
  gc3 --> addUnusedWordsToDictionary
  gb1 --> launchWordShip
  gbb2 --> WORDSHIP
  gbb1 --> selectRandomWord
  gbb3 --> Level
  gbb5 --> deleteShip
  gbb6 --> destroyShip
  gccc3 --> getPercentageDone
  g02 --> startNewLevel
  gg2 --> loadLevel
  gg3 --> startLevelSequence
  
  classDef pink fill:#FF91E7,stroke:#333,stroke-width:5px,font-size:3rem,font-weight:700
  classDef green fill:#027F55,stroke:#333,stroke-width:2px,font-size:3rem,font-weight:700
```
  
