/*jslint browser: true, indent: 3 */

/*
CS 3312, Spring 2019
Final Project
Josh Meek & Chad Fry
*/

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   (function () {
   var createWumpusWorld;

   //Create a factory that makes an object to keep track of the WumpusWorld
   createWumpusWorld = function (oldState) {
      var self, state, x,y, randomizeWumpusBoard;

      randomizeWumpusBoard = function () {
         //Randomize Wumpus Location.
         do {
            // set the x and y coordinates to random-numbers between 0 and 3
            state.wumpusLocation.x = Math.floor(Math.random() * 4);
            state.wumpusLocation.y = Math.floor(Math.random() * 4);
            // make sure the wumpus doesn't start on top of the player.
         } while(state.wumpusLocation.x === 0 && state.wumpusLocation.y === 0);


         // Randomize Gold Location.
         state.goldLocation.x = Math.floor(Math.random() * 4);
         state.goldLocation.y = Math.floor(Math.random() * 4);

         // Randomize Pits.
         for(x = 0; x < 4; x += 1) {
            for(y = 0; y < 4; y += 1) {
               if(x === 0 && y === 0) {
                  // always make sure spawn is not a pit.
                  state.isPit[x][y] = false;
               } else {
                  // generate a random num between 0 and 4 inclusive (so each num has 20% chance)
                  // here I pick 3 arbitrarily.
                  // if we generate 3, then that pit gets enabled.
                  if(Math.random() < 0.2) {
                     state.isPit[x][y] = true;
                  }
               }
            }
         }

      };

      //Create a default starting state.
      state = {
         playerLocation: {
            x: 0,
            y: 0
         },
         goldLocation: {
            x: 0,
            y: 0
         },
         wumpusLocation: {
            // make sure the wumpus starts in an impossible place.
            // we don't want to start with the player dying.
            // he will get randomized when the randomizeWumpusBoard funciton
            // is called.
            x:  -10,
            y:  -10
         },

         // a 2d array of pits. by default, nothing is a pit.
         // we can use this as follows: if (isPit[playerLocation.x][playerLocation.y]) {gameOver()};

         // NOTE FOR JOSH: you may be concerened that 0,0 in the isPit array
         // does not directly correspond to 0,0 on the wumpus-map (0,0 here is in top-left
         // because of JavaScript, and not the bottom-left!). However, we will simply treat it
         // like a parallel  array in CS 1.

         // in other words, as long as we are consistant in our mapping of
         // coordinates, there will be no need for translation.
         isPit: [
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
         ],


         playerMoves: 0,
         hasArrow: true,
         hasGold: false,
         playerScore: 0,
         playerWin: false,
         playerLose: false,
         displayAI: true,
         displayBoard: true,
         displayHowToPlay: true,
         displayDescription: true,
         lastMoveMade: '',

         // what can the player currently sense.
         senseBreeze: false,
         senseBump: false,
         senseStench: false,
         senseGlitter: false,
         senseScream: false
      };

      // shuffle everything up for the beginning of the round.
      // (I looked at the example from studio-8, doing this only effects
      // newgames. refreshes)


      //If there is a valid previous state, use it instead.
      // we want this, as it will cause pages to retain info during
      // refereshes and browser-closings.
      // we can have another function that goes and removes the old state.

      randomizeWumpusBoard();


      if (typeof oldState === 'string') {
         try {
            state = JSON.parse(oldState);
         } catch (ignore) {
         }
      }

      //The self object contains public methods
      self = {

         getPlayerLocation: function () {
            var locationCopy = state.playerLocation;
            return locationCopy; //Return the player location
         },
         getPercept: function () {
            return state.perceptText; //Return the percept
         },
         getArrowStatus: function () {
            return state.hasArrow; //Return whether or not the player has an arrow
         },
         getPlayerMoves: function () {
            return state.playerMoves; //Return the number of player moves
         },
         getDisplayAI: function () {
            return state.displayAI;
         },
         getSenseBreeze: function () {
            return state.senseBreeze;
         },
         getSenseStench: function () {
            return state.senseStench;
         },
         getSenseGlitter: function () {
            return state.senseGlitter;
         },
         getSenseBump: function () {
            return state.senseBump;
         },
         getDisplayBoard: function () {
            return state.displayBoard;
         },
         getDisplayDescription: function () {
            return state.displayDescription;
         },
         getDisplayHowToPlay: function () {
            return state.displayHowToPlay;
         },
         getPlayerScore: function () {
            return state.playerScore;
         },
         getWumpusLocation: function () {
            var wumpusLocationCopy = state.wumpusLocation;
            return wumpusLocationCopy;
         },
         getGoldLocation: function () {
            return state.goldLocation;
         },
         getHasGold: function () {
            return state.hasGold;
         },
         getPlayerWin: function () {
            return state.playerWin;
         },
         getPlayerLose: function () {
            return state.playerLose;
         },
         getIsPit: function () {
            return state.isPit;
         },
         getSenseScream: function () {
            return state.senseScream;
         },
         setSenseScream: function (someBool) {
            state.senseScream = someBool;
         },
         setDisplayAI: function (someBool) {
            // maybe we should do a typeof check here to ensure
            // that someBool is actually a bool??? who knows.
            state.displayAI = someBool;
         },
         setDisplayBoard: function (someBool) {
            state.displayBoard = someBool;
         },
         setDisplayHowToPlay: function (someBool) {
            state.displayHowToPlay = someBool;
         },
         setDisplayDescription: function (someBool) {
            state.displayDescription = someBool;
         },
         setPercept: function (newText) {
            state.perceptText = newText; //Set the new percept
         },
         setLastMoveMade: function (newText) {
            state.lastMoveMade = newText; //Set the last move made
         },
         setPlayerLocation: function (xCoord,yCoord) {
            state.playerLocation.x = xCoord; //Set the player location
            state.playerLocation.y = yCoord;
         },
         setArrowStatus: function () {
            state.hasArrow = false; //Shot arrow, so set that the player doesn't have an arrow
         },
         setPlayerMoves: function () {
            state.playerMoves += 1; //Increment the number of player moves
         },
         setPlayerLose: function () {
            state.playerLose = true;
         },
         setPlayerWin: function () {
            state.playerWin = true;
         },
         shootArrow: function () {
            state.hasArrow = false;
         },
         setPlayerScore: function (someNumber) {
            state.playerScore += someNumber;
         },
         setWumpusLocation: function (xCoord,yCoord) {
            state.wumpusLocation.x = xCoord;
            state.wumpusLocation.y = yCoord;
         },
         setPlayerHasGold: function () {
            state.hasGold = true;
         },
         setSenseBreeze: function (someBool) {
            state.senseBreeze = someBool;
         },
         setSenseBump: function (someBool) {
            state.senseBump = someBool;
         },
         setSenseStench: function (someBool) {
            state.senseStench = someBool;
         },
         setSenseGlitter: function (someBool) {
            state.senseGlitter = someBool;
         },
         getState: function () {
            return JSON.stringify(state);
         },
         resetGame: function () {
            // reset the game itself.
            state.playerLocation.x = 0;
            state.playerLocation.y = 0;
            state.playerMoves = 0;
            state.hasArrow = true;
            state.perceptText = '';
            //state.playerScore = 0; (actually, playerScore should be loaded)
            state.playerWin = false;
            state.playerLose = false;
            state.hasGold = false;
            state.senseBreeze = false;
            state.senseBump = false;
            state.senseStench = false;
            state.senseGlitter = false;
            state.senseScream = false;
            // don't reset the displays, since those should be memorized.
            var j,k;

            // reset the pits to all not exist.
            for(j = 0; j < 4; j++) {
               for (k = 0; k < 4; k++) {
                  state.isPit[j][k] = false;
               }
            }
            // then randomize everything.
            randomizeWumpusBoard();
         }

      };

      //Freeze the self object, so it can't be modified.
      return Object.freeze(self);
   };

   //Create a new closure to hide the view and controller from the model code above.
   (function () {
      var wumpusWorld, updateWumpusWorld;

      // Save the new state in web-storage, if we can.
      updateWumpusWorld = function () {

         // Save the state in web storage if available.
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('Wumpus World State', wumpusWorld.getState());
         }

         // now update the view accordingly, by hiding elements that are marked as hidden.

         // correctly display the gameDescription.
         if (!wumpusWorld.getDisplayDescription()) {
            document.querySelector('#gameDescriptionBox').style.display = "none";
         }

         if (wumpusWorld.getDisplayDescription()) {
            document.querySelector('#gameDescriptionBox').style.display = "";
         }

         // correctly display the how-to-play section.
         if (!wumpusWorld.getDisplayHowToPlay()) {
            document.querySelector('#HowToPlay').style.display = "none";
         }
         if (wumpusWorld.getDisplayHowToPlay()) {
            document.querySelector('#HowToPlay').style.display = "";
         }

         if (!wumpusWorld.getDisplayBoard()) {
            document.querySelector('#cave-area').style.display = "none";
         }
         if (wumpusWorld.getDisplayBoard()) {
            document.querySelector('#cave-area').style.display = "";
         }

         // check the model for game-over or win here, by looking at wumpusWorld. also here is where we
         // will change the percept text- based on the contents of wumpusWorld.
         if(wumpusWorld.getPlayerWin() || wumpusWorld.getPlayerLose()) {

            // if we are here, game is over- display appropriate game over screen.

            // display win text when necessary
            if(wumpusWorld.getPlayerWin()) {
               document.querySelector('#win-text').style.display="";
            } else {
               document.querySelector('#win-text').style.display="none";
            }

            // display lose text when necessary.
            if(wumpusWorld.getPlayerLose()) {
               document.querySelector('#lose-text').style.display="";
            } else {
               document.querySelector('#lose-text').style.display="none";

            }

         } else {

            // if we are here, then the game is ongoing. display senses accordingly.

            // since the game is ongoing, we should hide the win/lose text.
            document.querySelector('#win-text').style.display="none";
            document.querySelector('#lose-text').style.display="none";


            if(wumpusWorld.getSenseBump()) {
               document.querySelector('#bump-percept-text').style.display="";
            } else {
               document.querySelector('#bump-percept-text').style.display="none";
            }


            if(wumpusWorld.getSenseBreeze()) {
               document.querySelector('#breeze-percept-text').style.display="";
            } else {
               document.querySelector('#breeze-percept-text').style.display="none";
            }

            if(wumpusWorld.getSenseScream()) {
               document.querySelector('#scream-percept-text').style.display="";
            } else {
               document.querySelector('#scream-percept-text').style.display="none";
            }

            if(wumpusWorld.getSenseStench()) {
               document.querySelector('#stench-percept-text').style.display="";
            } else {
               document.querySelector('#stench-percept-text').style.display="none";
            }

            if(wumpusWorld.getSenseGlitter()) {
               document.querySelector('#glitter-percept-text').style.display="";
            } else {
               document.querySelector('#glitter-percept-text').style.display="none";
            }

            // if there are no percepts to be sensed, make it clear.
            if(!wumpusWorld.getSenseBump() && !wumpusWorld.getSenseBreeze() && !wumpusWorld.getSenseScream() && !wumpusWorld.getSenseStench() && !wumpusWorld.getSenseGlitter()) {
               document.querySelector('#default-percept-text').style.display="";
            }
            else document.querySelector('#default-percept-text').style.display="none";

         }





         // NOTE: we probably won't ever have a need to do this,
         //       but if we were to update the controller (buttons / toggles),
         //       this is where those changes would go.

      };

         // Setup the wumpus-world controller here!





// ---------------------------------------------------------------------------
//                  === Toggle Events ===

         // setup description toggle
         document.querySelector('#game-description').addEventListener('click', function () {
               if(document.querySelector('#game-description').checked) {
                  wumpusWorld.setDisplayDescription(true);
               }
               else {
                  wumpusWorld.setDisplayDescription(false);
               }
               updateWumpusWorld();
         }, false);

         //setup the gameboard toggle
         document.querySelector('#wumpusBoard').addEventListener('click', function () {
               if(document.querySelector('#wumpusBoard').checked) {
                  wumpusWorld.setDisplayBoard(true);
               }
               else {
                  wumpusWorld.setDisplayBoard(false);
               }
               updateWumpusWorld();
         }, false);

         // setup how-to-play toggle
         document.querySelector('#how-to-play').addEventListener('click', function () {
               if(document.querySelector('#how-to-play').checked) {
                  wumpusWorld.setDisplayHowToPlay(true);
               }
               else {
                  wumpusWorld.setDisplayHowToPlay(false);
               }
               updateWumpusWorld();
         }, false);

         // setup AI-toggle here

         // setup Scoreboard-toggle here

         // ---------------------------------------------------------------------------




         //reset game on button-press.
         document.querySelector('#reset-button').addEventListener('click', function () {
            wumpusWorld.resetGame();
            updateWumpusWorld();
         }, false);


         // ---------------------------------------------------------------------------
         //                ===== Handle Player movement and actions =====

         document.addEventListener('keydown', function (keyCode) {



            if(!wumpusWorld.getPlayerWin() && !wumpusWorld.getPlayerLose()) {

               if (keyCode.code === 'KeyW') {
                  alert('w was pressed!');
                  // is the player trying to pass through a wall?
                  if(wumpusWorld.getPlayerLocation().y === 3) {
                     wumpusWorld.setSenseBump(true);
                     wumpusWorld.setPlayerScore(-1);
                  }
                  else {
                     // place the player accordingly.
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y + 1);
                  }
               }

               if (keyCode.code === 'KeyA') {
                  alert('a was pressed!');
                  if (wumpusWorld.getPlayerLocation().x === 0) {
                     wumpusWorld.setSenseBump(true);
                     wumpusWorld.setPlayerScore(-1);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x - 1, wumpusWorld.getPlayerLocation().y);
                  }
               }
               if (keyCode.code === 'KeyS') {
                  alert('s was pressed!');
                  if (wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setSenseBump(true);
                     wumpusWorld.setPlayerScore(-1);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y - 1);
                  }
               }
               if (keyCode.code === 'KeyD') {
                  alert('d was pressed!');
                  if (wumpusWorld.getPlayerLocation().x === 3) {
                     wumpusWorld.setSenseBump(true);
                     wumpusWorld.setPlayerScore(-1);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x + 1, wumpusWorld.getPlayerLocation().y);
                  }
               }


               if (keyCode.code === 'KeyC') {
                  alert('c was pressed!');
                  if (wumpusWorld.getPlayerLocation().x === 0 && wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setPlayerWin(true); // they 'technically' win, but with a score of 0.;
                  } else {
                     wumpusWorld.setPlayerScore(-1); //Subtract a point cause they bump their noggin
                  }
               }





               // handle player attacks / interactions.
               if (keyCode.code === 'Enter') {
                  alert('Enter was was pressed!');
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
                     wumpusWorld.setPlayerHasGold();
                     wumpusWorld.setSenseGlitter(false);
                  }
               }
               if (keyCode.code === 'ArrowUp') {
                  alert('Shot arrow up');
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y < wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setPlayerScore(-10);
                  } else wumpusWorld.setSenseScream(false);
               }
               if (keyCode.code === 'ArrowDown') {
                  alert('Shot arrow down');
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y > wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setPlayerScore(-10);
                  } else wumpusWorld.setSenseScream(false);
               }
               if (keyCode.code === 'ArrowLeft') {
                  alert('Shot arrow left');
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x > wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setPlayerScore(-10);
                  } else wumpusWorld.setSenseScream(false);
               }
               if (keyCode.code === 'ArrowRight') {
                  alert('Shot arrow right');
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x < wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setPlayerScore(-10);
                  } else wumpusWorld.setSenseScream(false);
               }

               //Setup controller to check for player death
               if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setPlayerLose();
                     wumpusWorld.setPlayerScore(-1000);
               }

               //Check for pit death
               var tempPit = wumpusWorld.getIsPit();
               if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y]) {
                  wumpusWorld.setPlayerLose();
                  wumpusWorld.setPlayerScore(-1000);
               }


               // NOTE: we need to check for stench and breeze when the game
               // starts, not *just* when buttons are pressed.


               //Check for pit breeze, but only check existing squares.
               var pitsAroundPlayer = 0;

               if (wumpusWorld.getPlayerLocation().x < 3) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x + 1][wumpusWorld.getPlayerLocation().y]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer +=1;
                  }
               }

               if (wumpusWorld.getPlayerLocation().x > 0) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x - 1][wumpusWorld.getPlayerLocation().y]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer +=1;
                  }
               }

               if(wumpusWorld.getPlayerLocation().y < 3) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y + 1]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer +=1;
                  }
               }

               if(wumpusWorld.getPlayerLocation().y > 0) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y - 1]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer +=1;
                  }
               }

               if (pitsAroundPlayer === 0) {
                  wumpusWorld.setSenseBreeze(false);
               }

               //Check for Stench
               //Right
               var wumpiiAroundPlayer = 0; //technically, this should never be more than 1.

               if(wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x + 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }
               //Left
               if(wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x - 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }
               //Up
               if(wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y + 1) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }
               //Down
               if(wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y - 1){
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }

               //Check for gold
               if(wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
                  wumpusWorld.setSenseGlitter(true);
                  wumpiiAroundPlayer += 1;
               } else wumpusWorld.setSenseGlitter(false);

               if(wumpiiAroundPlayer === 0) {
                  wumpusWorld.setSenseStench(false);
               }

               // update the visual, because the player has done *something*.
               updateWumpusWorld();
            }
            updateWumpusWorld();
         });

         // When the page is loaded, get any saved state from web storage and use it.
         wumpusWorld = createWumpusWorld(localStorage && localStorage.getItem && localStorage.getItem('Wumpus World State'));
         // Update everything else based on the new model state.
         updateWumpusWorld();
   }());
}());
}, false);
