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
      var createWumpusWorld; //Create the variable used when creating the WumpusWorld

      //*****************************************************************************
      //**************************BEGINNING OF MODEL*********************************
      //*****************************************************************************

      //Create a factory that makes an object to keep track of the WumpusWorld
      createWumpusWorld = function (oldState) {
         var self, state, x, y, randomizeWumpusBoard;

         //*****************************************************************************
         //************************Randomize WumpusBoard Function***********************
         //*****************************************************************************
         randomizeWumpusBoard = function () {

            //Randomize the Wumpus Board
            do {
               state.wumpusLocation.x = Math.floor(Math.random() * 4); // Get a random x coordinate between 0 and 3
               state.wumpusLocation.y = Math.floor(Math.random() * 4); // Get a random y coordinate between 0 and 3
            } while (state.wumpusLocation.x === 0 && state.wumpusLocation.y === 0); // Make sure the wumpus doesn't start at (0,0)

            // Randomize Gold Location.
            state.goldLocation.x = Math.floor(Math.random() * 4);
            state.goldLocation.y = Math.floor(Math.random() * 4);

            // Randomize Pits.
            for (x = 0; x < 4; x += 1) {
               for (y = 0; y < 4; y += 1) {
                  if (x === 0 && y === 0) {
                     state.isPit[x][y] = false; //Make sure the player spawn is not a pit
                  } else {
                     //There is a 20% chance that each cavern will become a pit.
                     if (Math.random() < 0.2) {
                        state.isPit[x][y] = true;
                     }
                  }
               }
            }
         };
         //*****************************************************************************
         //**********************End Randomize WumpusBoard Function*********************
         //*****************************************************************************


         //*****************************************************************************
         //************************Create a default starting state**********************
         //*****************************************************************************
         state = {
            playerLocation: { //Player starts at (0,0)
               x: 0,
               y: 0
            },
            goldLocation: { //Gold starts at (0,0) and is randomized
               x: 0,
               y: 0
            },
            wumpusLocation: { //Put the wumpus at a impossible spot, then randomize it
               x:  -10,
               y:  -10
            },

            //Create a 2D array to keep track of pits and by default they are not in the rooms
            isPit: [
               [false, false, false, false],
               [false, false, false, false],
               [false, false, false, false],
               [false, false, false, false]
            ],

            //Conditions for the game. Set them all to a starting state
            gameInProgress: false,
            highScore: 0,
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
            displayScore: true,
            lastMoveMade: '',

            //Percepts that can be sensed by the player, set them all false
            senseBreeze: false,
            senseBump: false,
            senseStench: false,
            senseGlitter: false,
            senseScream: false,

            //Keep track of the current action recommended by the AI
            aiReccomend: '',

            //Keep track of the last action recommended by the AI
            lastRecommendation: '',

            //Used to decide whether or not the player path needs to be unraveled
            checkForBreadCrumbs: false,

            //Set the cave as a 4-by-4
            Cave: [
               [{DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}],
               [{DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}],
               [{DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}],
               [{DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}, {DangerLevel: -1, visitedBefore: false,  Wumpus: 0, Pit: 0}]
            ],

            //Keep track of all moves made by the player.
            MovesMade: []
         };
         //*****************************************************************************
         //**************************End default starting state*************************
         //*****************************************************************************

         randomizeWumpusBoard(); //Randomize the wumpus board

         //If there is a valid previous state, use it instead. Retain info from refresh and browser closing
         if (typeof oldState === 'string') {
            try {
               state = JSON.parse(oldState);
            } catch (ignore) {
            }
         }

         //*****************************************************************************
         //*********************Self object contains public methods*********************
         //*****************************************************************************
         self = {

            //*****************************************************************************
            //**************************Artificial Intelligence****************************
            //*****************************************************************************
            //We used Chad's AI from the AI class
            agentHollowKnight: function () {

               //Use the lastMove made for pathfinding, declare other variables
               var lastMove = state.MovesMade[state.MovesMade.length - 1], n, m, o, p;

               //If statement for unraveling the player's path
               if (state.checkForBreadCrumbs) {
                  state.MovesMade.pop(); //Pop the MovesMade array if unraveling moves
               }

               //If we don't have the gold and we perceive, recommend grabbing the gold
               if (!state.HasGold && state.senseGlitter) {
                  return 'Grab The Gold!';
               }

               //If the wumpus dies, mark all rooms wumpus-free for the ai.
               if (state.senseScream) {
                  for (x = 0; x < 4; x += 1) {
                     for (y = 0; y < 4; y += 1) {
                        state.Cave[x][y].Wumpus = -100;
                     }
                  }
               }

               //If there is a breeze at spawn, don't chance it, climb out.
               if (state.playerLocation.x === 0 && state.playerLocation.y === 0) {
                  if (state.senseBreeze) {
                     return 'Climb Out, this is too risky!';
                  }
               }

               //If we don't sense a breeze, the rooms adjacent don't have a pit.
               if (!state.senseBreeze) {

                  if (state.playerLocation.x + 1 <= 3) {
                     state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Pit = -5;
                  }

                  if (state.playerLocation.x - 1 >= 0) {
                     state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Pit = -5;
                  }

                  if (state.playerLocation.y - 1 >= 0) {
                     state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Pit = -5;
                  }

                  if (state.playerLocation.y + 1 <= 3) {
                     state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Pit = -5;
                  }

               }

               //If the player doesn't have the arrow, and the last move was shoot-left, mark those as safe.
               if (!state.hasArrow && state.lastMoveMade === 'shootLeft') {
                  for (n = state.playerLocation.x; n >= 0; n -= 1) {
                     state.Cave[n][state.playerLocation.y].Wumpus = -5;
                  }
               }

               //If the player doesn't have the arrow, and the last move was shoot-Right, mark those as safe.
               if (!state.hasArrow && state.lastMoveMade === 'shootRight') {
                  for (m = state.playerLocation.x; m <= 3; m += 1) {
                     state.Cave[m][state.playerLocation.y].Wumpus = -5;
                  }
               }

               //If the player doesn't have the arrow, and the last move was shoot-Down, mark those as safe.
               if (!state.hasArrow && state.lastMoveMade === 'shootDown') {
                  for (o = state.playerLocation.y; o >= 0; o -= 1) {
                     state.Cave[state.playerLocation.x][o].Wumpus = -5;
                  }
               }

               //If the player doesn't have the arrow, and the last move was shoot-up, mark those as safe.
               if (!state.hasArrow && state.lastMoveMade === 'shootUp') {
                  for (p = state.playerLocation.y; p <= 3; p += 1) {
                     state.Cave[state.playerLocation.x][p].Wumpus = -5;
                  }
               }

               //Make sure we don't waste time looking at lastMove if it isn't defined.
               if (lastMove !== undefined) {

                  //Player just moved up, mark the room as explored.
                  if (lastMove === 'MoveUp') {
                     if (state.playerLocation.y - 1 >= 0) {
                        state.Cave[state.playerLocation.x][state.playerLocation.y - 1].visitedBefore = true;
                     }
                  }

                  //Player just moved down, mark the room as explored.
                  if (lastMove === 'MoveDown') {
                     if (state.playerLocation.y + 1 <= 3) {
                        state.Cave[state.playerLocation.x][state.playerLocation.y + 1].visitedBefore = true;
                     }
                  }

                  //Player just moved left, mark the room as explored.
                  if (lastMove === 'MoveLeft') {
                     if (state.playerLocation.x + 1 <= 3) {
                        state.Cave[state.playerLocation.x + 1][state.playerLocation.y].visitedBefore = true;
                     }
                  }

                  //Player just moved right, mark the room as explored.
                  if (lastMove === 'MoveRight') {
                     if (state.playerLocation.x - 1 >= 0) {
                        state.Cave[state.playerLocation.x - 1][state.playerLocation.y].visitedBefore = true;
                     }
                  }
               }

               //Check surrounding for a breeze or stench.
               if (state.senseBreeze || state.senseStench) {

                  //Consider the room to the west of the player.
                  if (state.playerLocation.x - 1 >= 0) {
                     if (!state.Cave[state.playerLocation.x - 1][state.playerLocation.y].visitedBefore) {
                        if (state.senseStench && !state.senseBreeze) {
                           state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Wumpus += 1;
                           if (state.hasArrow && state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Wumpus >= 1) {
                              return 'Shoot The Arrow Left!';
                           }
                        } else {
                           state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Pit += 1;
                        }
                     }
                  }

                  //Consider the room to the east of the player.
                  if (state.playerLocation.x + 1 <= 3) {
                     if (!state.Cave[state.playerLocation.x + 1][state.playerLocation.y].visitedBefore) {
                        if (state.senseStench && !state.senseBreeze) {
                           state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Wumpus += 1;
                           if (state.hasArrow && state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Wumpus >= 1) {
                              return 'Shoot The Arrow Right!';
                           }
                        } else {
                           state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Pit += 1;
                        }
                     }
                  }

                  //Consider the room to the south of the player.
                  if (state.playerLocation.y - 1 >= 0) {
                     if (!state.Cave[state.playerLocation.x][state.playerLocation.y - 1].visitedBefore) {
                        if (state.senseStench && !state.senseBreeze) {
                           state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Wumpus += 1;
                           if (state.hasArrow && state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Wumpus >= 1) {
                              return 'Shoot The Arrow Down!';
                           }
                        } else {
                           state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Pit += 1;
                        }
                     }
                  }

                  //Consider the room to the north of the player.
                  if (state.playerLocation.y + 1 <= 3) {
                     if (!state.Cave[state.playerLocation.x][state.playerLocation.y + 1].visitedBefore) {
                        if (state.senseStench && !state.senseBreeze) {
                           state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Wumpus += 1;
                           if (state.hasArrow && state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Wumpus >= 1) {
                              return 'Shoot The Arrow Up!';
                           }
                        } else {
                           state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Pit += 1;
                        }
                     }
                  }
               }

               //If the player doesn't have the gold, explore the first safe unexplored room
               if (!state.hasGold) {

                  //Look to the east
                  if (state.playerLocation.x + 1 <= 3) {
                     if (state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Wumpus <= 0 && state.Cave[state.playerLocation.x + 1][state.playerLocation.y].Pit <= 0 && state.Cave[state.playerLocation.x + 1][state.playerLocation.y].visitedBefore === false) {
                        state.lastRecommendation = 'MoveRight';
                        state.checkForBreadCrumbs = false;
                        return 'Try Moving Right!';
                     }
                  }

                  //Look to the north
                  if (state.playerLocation.y + 1 <= 3) {
                     if (state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Wumpus <= 0 && state.Cave[state.playerLocation.x][state.playerLocation.y + 1].Pit <= 0 && state.Cave[state.playerLocation.x][state.playerLocation.y + 1].visitedBefore === false) {
                        state.lastRecommendation = 'MoveUp';
                        state.checkForBreadCrumbs = false;
                        return 'Try Moving Up!';
                     }
                  }

                  //Look to the west
                  if (state.playerLocation.x - 1 >= 0) {
                     if (state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Wumpus <= 0 && state.Cave[state.playerLocation.x - 1][state.playerLocation.y].Pit <= 0 && state.Cave[state.playerLocation.x - 1][state.playerLocation.y].visitedBefore === false) {
                        state.lastRecommendation = 'MoveLeft';
                        state.checkForBreadCrumbs = false;
                        return 'Try Moving Left!';
                     }
                  }

                  //Look to the south
                  if (state.playerLocation.y - 1 >= 0) {
                     if (state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Wumpus <= 0 && state.Cave[state.playerLocation.x][state.playerLocation.y - 1].Pit <= 0 && state.Cave[state.playerLocation.x][state.playerLocation.y - 1].visitedBefore === false) {
                        state.lastRecommendation = 'MoveDown';
                        state.checkForBreadCrumbs = false;
                        return 'Try Moving Down!';
                     }
                  }

                  //If it gets to this point in the code, there is no safe room that is
                  //unexplored that we are able to get to. Go back to the last room and
                  //see if there is a safe room from there.

                  //If we're at 0,0 and there are no safe rooms... lets go home.
                  if (state.playerLocation.x === 0 && state.playerLocation.y === 0) {
                     return 'Try Climbing Out!';
                  }

                  //otherwise, we need to retrace our steps.
                  //look at our last move, and return its opposite.
                  if (lastMove !== undefined) {
                     if (lastMove === 'MoveUp') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveDown';
                        return 'Try Moving Down.';
                     }
                     if (lastMove === 'MoveDown') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveUp';
                        return 'Try Moving Up';
                     }
                     if (lastMove === 'MoveLeft') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveRight';
                        return 'Try Moving Right';
                     }
                     if (lastMove === 'MoveRight') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveLeft';
                        return 'Try Moving Left';
                     }
                  }
               }

               //Conditions for if the player has the gold
               if (state.hasGold) {

                  //If the player is in (0,0) with gold, climb out
                  if (state.playerLocation.x === 0 && state.playerLocation.y === 0) {
                     return 'Climb Out With Your Riches!';
                  }

                  //Backtrace to escape the cave
                  if (lastMove !== undefined) {
                     if (lastMove === 'MoveUp') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveDown';
                        return 'Try Moving Down.';
                     }
                     if (lastMove === 'MoveDown') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveUp';
                        return 'Try Moving Up';
                     }
                     if (lastMove === 'MoveLeft') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveRight';
                        return 'Try Moving Right';
                     }
                     if (lastMove === 'MoveRight') {
                        state.checkForBreadCrumbs = true;
                        state.lastRecommendation = 'MoveLeft';
                        return 'Try Moving Left';
                     }
                  }
               }

               //Display if the AI gets lost in its recommendations
               return 'uhhh... sorry, AI got lost!';
            },
            //*****************************************************************************
            //************************End of Artificial Intelligence***********************
            //*****************************************************************************

            getPlayerLocation: function () {
               var locationCopy = state.playerLocation;
               return locationCopy; //Return the player location
            },
            getPercept: function () {
               return state.perceptText; //Return the percept
            },
            getPlayerMoves: function () {
               return state.playerMoves; //Return the number of player moves
            },
            getDisplayAI: function () {
               return state.displayAI; //Return the AI recommendation
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
         getDisplayScore: function () {
            return state.displayScore;
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
         getHighScore: function () {
            return state.highScore;
         },
         setSenseScream: function (someBool) {
            state.senseScream = someBool;
         },
         setDisplayAI: function (someBool) {
            // maybe we should do a typeof check here to ensure
            // that someBool is actually a bool??? who knows.
            state.displayAI = someBool;
         },
         setDisplayScore: function (someBool) {
            state.displayScore = someBool;
         },
         setHasArrow: function (someBool) {
            state.hasArrow = someBool;
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
         setPushMovesMade: function (someMovement) {
            state.MovesMade.push(someMovement);
         },
         setPlayerMoves: function () {
            state.playerMoves += 1; //Increment the number of player moves
         },
         setPlayerLose: function () {
            if(state.playerScore > state.highScore) {
               state.highScore = state.playerScore;
            }
            state.playerLose = true;
         },
         setPlayerWin: function () {
            if(state.hasGold) {
               state.playerScore += 1000;
            }
            if(state.playerScore > state.highScore) {
               state.highScore = state.playerScore;
            }
            state.playerWin = true;
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
         setRemoveGold: function () {
            state.goldLocation.x = -100;
            state.goldLocation.y = -100;
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
            for(j = 0; j < 4; j += 1) {
               for (k = 0; k < 4; k += 1) {
                  state.isPit[j][k] = false;
               }
            }




            // Now, reset the AI's stuff.
            for (j = 0; j < 4; j += 1) {
               for (k = 0; k < 4; k += 1) {
                  state.Cave[j][k].DangerLevel = -1;
                  state.Cave[j][k].visitedBefore = false;
                  state.Cave[j][k].Wumpus = 0;
                  state.Cave[j][k].Pit = 0;
               }
            }

            state.Cave[0][0].visitedBefore = true;
            state.Cave[0][0].DangerLevel = -1;

            // empty out the AI's moves-made array.
            for (j = 0; j < state.MovesMade.length; j += 1) {
               state.MovesMade.pop();
            }
            state.lastRecommendation = '';
            state.lastMoveMade = '';
            state.aiReccomend = '';
            state.checkForBreadCrumbs = false;
            // then randomize everything.
            randomizeWumpusBoard();
         }

      };
         //*****************************************************************************
         //*****************************End of Self Object******************************
         //*****************************************************************************

      //Freeze the self object, so it can't be modified.
      return Object.freeze(self);
   };

   //*****************************************************************************
   //*****************************END OF MODEL************************************
   //*****************************************************************************
   
   
   
   
   

   //Create a new closure to hide the view and controller from the model code above.
   (function () {
      var wumpusWorld, updateWumpusWorld;

      // Save the new state in web-storage, if we can.
      updateWumpusWorld = function () {

         // Save the state in web storage if available.
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('Wumpus World State', wumpusWorld.getState());
         }


                        // ****************************************************
                        // UPDATE CONTROLLER / MODEL BEFORE ANYTHING LOADS.

                        var pitsAroundPlayer = 0, tempPit = wumpusWorld.getIsPit(), wumpiiAroundPlayer;

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
                        wumpiiAroundPlayer = 0; //technically, this should never be more than 1.

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
                        } else {
                           wumpusWorld.setSenseGlitter(false);
                        }

                        if(wumpiiAroundPlayer === 0) {
                           wumpusWorld.setSenseStench(false);
                        }

                        // END OF UPDATE MODEL / CONTROLLER
                        // ****************************************************







                        // ****************************************************
                        //       AI CODE GOES HERE. I THINK.
                        //
                        // AI will update the model's "AIReccomends" string.
                        // this way, the string will get handled easily by the view.
                        // since all percepts were handled above, the ai is now
                        // set to look at them, and set the AIReccomends string
                        // accordingly. I really wish we could put this code in
                        // a seperate file. because hoo-boy would it look
                        // ugly here.

                        // define what a room is to the ai.

                        //              END OF AI CODE
                        // ****************************************************


         // now update the view accordingly, by hiding elements that are marked as hidden.




         // correctly display the gameDescription.
         if (!wumpusWorld.getDisplayDescription()) {
            document.querySelector('#gameDescriptionBox').style.display = "none";
         }

         if (wumpusWorld.getDisplayDescription()) {
            document.querySelector('#gameDescriptionBox').style.display = "";
         }

         // correctly display the high score.
         if (!wumpusWorld.getDisplayScore()) {
            document.querySelector('#high-score-box').style.display = "none";
         }

         if (wumpusWorld.getDisplayScore()) {
            document.querySelector('#high-score-box').style.display = "";
         }

         //correctly display the AI
         if (!wumpusWorld.getDisplayAI()) {
            document.querySelector('#AI-box').style.display="none";

         }

         if (wumpusWorld.getDisplayAI()) {
            document.querySelector('#AI-box').style.display="";

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
               document.querySelector('#score-text').textContent="Total Score: " + wumpusWorld.getPlayerScore();
            } else {
               document.querySelector('#win-text').style.display="none";

            }

            // display lose text when necessary.
            if(wumpusWorld.getPlayerLose()) {
               document.querySelector('#lose-text').style.display="";
               document.querySelector('#score-text').textContent="Total Score: " + wumpusWorld.getPlayerScore();
            } else {
               document.querySelector('#lose-text').style.display="none";

            }

         } else {

            // if we are here, then the game is ongoing. display senses accordingly.

            // display AI text.
            document.querySelector('#AI-text').textContent = wumpusWorld.agentHollowKnight();
            // display high score.
            document.querySelector('#high-score-text').textContent = wumpusWorld.getHighScore();
            // since the game is ongoing, we should hide the win/lose text.
            document.querySelector('#win-text').style.display="none";
            document.querySelector('#lose-text').style.display="none";
            document.querySelector('#score-text').textContent="";

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
            } else {
               document.querySelector('#default-percept-text').style.display="none";
            }

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
         document.querySelector('#ai-movement').addEventListener('click', function () {
               if(document.querySelector('#ai-movement').checked) {
                  wumpusWorld.setDisplayAI(true);
               }
               else {
                  wumpusWorld.setDisplayAI(false);
               }
               updateWumpusWorld();
         }, false);
         // ---------
         // setup Scoreboard-toggle here
         document.querySelector('#scorebox').addEventListener('click', function () {
               if(document.querySelector('#scorebox').checked) {
                  wumpusWorld.setDisplayScore(true);
               }
               else {
                  wumpusWorld.setDisplayScore(false);
               }
               updateWumpusWorld();
         }, false);
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
                  wumpusWorld.setPlayerScore(-1);
                  // is the player trying to pass through a wall?
                  if(wumpusWorld.getPlayerLocation().y === 3) {
                     wumpusWorld.setSenseBump(true);
                  }
                  else {
                     // place the player accordingly.
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y + 1);
                     wumpusWorld.setPushMovesMade('MoveUp');
                  }
               }

               if (keyCode.code === 'KeyA') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 0) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x - 1, wumpusWorld.getPlayerLocation().y);
                     wumpusWorld.setPushMovesMade('MoveLeft');
                  }
               }
               if (keyCode.code === 'KeyS') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y - 1);
                     wumpusWorld.setPushMovesMade('MoveDown');
                  }
               }
               if (keyCode.code === 'KeyD') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 3) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     //Place player accordingly
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x + 1, wumpusWorld.getPlayerLocation().y);
                     wumpusWorld.setPushMovesMade('MoveRight');
                  }
               }


               if (keyCode.code === 'KeyC') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 0 && wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setPlayerWin(true); // they 'technically' win, but with a score of 0.;
                  }
               }





               // handle player attacks / interactions.

               if (keyCode.code === 'KeyG') {
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
                     wumpusWorld.setPlayerHasGold();
                     //wumpusWorld.setPlayerScore(1000);
                     // move the gold imposisbly far away here.
                     wumpusWorld.setRemoveGold();
                     wumpusWorld.setSenseGlitter(false);
                  }
               }

               wumpusWorld.setSenseScream(false);

               if (keyCode.code === 'ArrowUp') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y < wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setLastMoveMade('shootUp');
                     // we need to set has arrow.

                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }
               if (keyCode.code === 'ArrowDown') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y > wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setLastMoveMade('shootDown');
                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }
               if (keyCode.code === 'ArrowLeft') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x > wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setLastMoveMade('shootLeft');

                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }
               if (keyCode.code === 'ArrowRight') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x < wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100,-100);
                     wumpusWorld.setLastMoveMade('shootRight');
                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }

               //Setup controller to check for player death
               if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setPlayerLose();
                     wumpusWorld.setPlayerScore(-1000);
               }

               //Check for pit death
               var tempPit = wumpusWorld.getIsPit(), pitsAroundPlayer, wumpiiAroundPlayer;
               if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y]) {
                  wumpusWorld.setPlayerLose();
                  wumpusWorld.setPlayerScore(-1000);
               }


               // NOTE: we need to check for stench and breeze when the game
               // starts, not *just* when buttons are pressed.


               //Check for pit breeze, but only check existing squares.
               pitsAroundPlayer = 0;

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
               wumpiiAroundPlayer = 0; //technically, this should never be more than 1.

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
               } else {
                  wumpusWorld.setSenseGlitter(false);
               }

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
