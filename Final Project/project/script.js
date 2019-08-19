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
               return state.senseBreeze; //Return the breeze percept
            },
            getSenseStench: function () {
               return state.senseStench; //Return the stench percept
            },
            getSenseGlitter: function () {
               return state.senseGlitter; //Return the glitter percept
            },
            getSenseBump: function () {
               return state.senseBump; //Return the bump percept
            },
            getDisplayBoard: function () {
               return state.displayBoard; //Display the game board
            },
            getDisplayDescription: function () {
               return state.displayDescription; //Display the game description
            },
            getDisplayHowToPlay: function () {
               return state.displayHowToPlay; //Display how to play
            },
            getPlayerScore: function () {
               return state.playerScore; //Get the player's score
            },
            getDisplayScore: function () {
               return state.displayScore; //Display the player's score
            },
            getWumpusLocation: function () {
               var wumpusLocationCopy = state.wumpusLocation;
               return wumpusLocationCopy; //Return the wumpus location
            },
            getGoldLocation: function () {
               return state.goldLocation; //Return the gold location
            },
            getHasGold: function () {
               return state.hasGold; //Return whether the player has gold
            },
            getPlayerWin: function () {
               return state.playerWin; //Return if the player won
            },
            getPlayerLose: function () {
               return state.playerLose; //Return if the player lost
            },
            getIsPit: function () {
               return state.isPit; //Return if the room is a pit
            },
            getSenseScream: function () {
               return state.senseScream; //Return if the wumpus got shot
            },
            getHighScore: function () {
               return state.highScore; //Return the high score
            },
            setSenseScream: function (someBool) {
               state.senseScream = someBool; //Set the wumpus scream percept
            },
            setDisplayAI: function (someBool) {
               state.displayAI = someBool; //Set to display the AI recommendations
            },
            setDisplayScore: function (someBool) {
               state.displayScore = someBool; //Set to display the score
            },
            setHasArrow: function (someBool) {
               state.hasArrow = someBool; //Set to tell whether the player still has an arrow
            },
            setDisplayBoard: function (someBool) {
               state.displayBoard = someBool; //Set to display the game board
            },
            setDisplayHowToPlay: function (someBool) {
               state.displayHowToPlay = someBool; //Set to display the how to play section
            },
            setDisplayDescription: function (someBool) {
               state.displayDescription = someBool; //Set to display the game description
            },
            setPercept: function (newText) {
               state.perceptText = newText; //Set the new percept
            },
            setLastMoveMade: function (newText) {
               state.lastMoveMade = newText; //Set the last move made
            },
            setPlayerLocation: function (xCoord, yCoord) {
               state.playerLocation.x = xCoord; //Set the player location
               state.playerLocation.y = yCoord;
            },
            setPushMovesMade: function (someMovement) {
               state.MovesMade.push(someMovement); //Push new moves onto the stack
            },
            setPlayerMoves: function () {
               state.playerMoves += 1; //Increment the number of player moves
            },
            setPlayerLose: function () {
               if (state.playerScore > state.highScore) {
                  state.highScore = state.playerScore; //Set a new highscore if needed
               }
               state.playerLose = true; //Player lost
            },
            setPlayerWin: function () {
               if (state.hasGold) {
                  state.playerScore += 1000; //Increment the player's score if they got the gold
               }
               if (state.playerScore > state.highScore) {
                  state.highScore = state.playerScore; //Set a new highscore if needed
               }
               state.playerWin = true; //Player won
            },
            setPlayerScore: function (someNumber) {
               state.playerScore += someNumber; //Adjust the players score
            },
            setWumpusLocation: function (xCoord, yCoord) {
               state.wumpusLocation.x = xCoord; //Set the wumpus x coordinate
               state.wumpusLocation.y = yCoord; //Set the wumpus y coordinate
            },
            setPlayerHasGold: function () {
               state.hasGold = true; //Player found the gold
            },
            setRemoveGold: function () {
               state.goldLocation.x = -100; //Remove the gold off the map
               state.goldLocation.y = -100; //Remove the gold off the map
            },
            setSenseBreeze: function (someBool) {
               state.senseBreeze = someBool; //Set the breeze percept
            },
            setSenseBump: function (someBool) {
               state.senseBump = someBool; //Set the bump percept
            },
            setSenseStench: function (someBool) {
               state.senseStench = someBool; //Set the stench percept
            },
            setSenseGlitter: function (someBool) {
               state.senseGlitter = someBool; //Set the glitter percept
            },
            getState: function () {
               return JSON.stringify(state);
            },
            resetGame: function () {
               state.playerLocation.x = 0;
               state.playerLocation.y = 0;
               state.playerMoves = 0;
               state.hasArrow = true;
               state.perceptText = '';
               state.playerWin = false;
               state.playerLose = false;
               state.hasGold = false;
               state.senseBreeze = false;
               state.senseBump = false;
               state.senseStench = false;
               state.senseGlitter = false;
               state.senseScream = false;

               var j, k; //Variables to use to reset stuff

               // Reset the pits to all not exist.
               for (j = 0; j < 4; j += 1) {
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

               // Empty out the AI's moves-made array.
               for (j = 0; j < state.MovesMade.length; j += 1) {
                  state.MovesMade.pop();
               }
               state.lastRecommendation = '';
               state.lastMoveMade = '';
               state.aiReccomend = '';
               state.checkForBreadCrumbs = false;

               randomizeWumpusBoard(); //Randomize everything
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



      //*****************************************************************************
      //****************************Begin View & Controller**************************
      //*****************************************************************************
      (function () {
         var wumpusWorld, updateWumpusWorld;

         updateWumpusWorld = function () {

            // Save the state in web storage if available.
            if (localStorage && localStorage.setItem) {
               localStorage.setItem('Wumpus World State', wumpusWorld.getState());
            }

            //*****************************************************************************
            //*********************************UPDATE VIEW*********************************
            //*****************************************************************************
            var pitsAroundPlayer = 0, tempPit = wumpusWorld.getIsPit(), wumpiiAroundPlayer;

            //Check for pit to the east
            if (wumpusWorld.getPlayerLocation().x < 3) {
               if (tempPit[wumpusWorld.getPlayerLocation().x + 1][wumpusWorld.getPlayerLocation().y]) {
                  wumpusWorld.setSenseBreeze(true);
                  pitsAroundPlayer += 1;
               }
            }

            //Check for pit to the west
            if (wumpusWorld.getPlayerLocation().x > 0) {
               if (tempPit[wumpusWorld.getPlayerLocation().x - 1][wumpusWorld.getPlayerLocation().y]) {
                  wumpusWorld.setSenseBreeze(true);
                  pitsAroundPlayer += 1;
               }
            }

            //Check for pit to the north
            if (wumpusWorld.getPlayerLocation().y < 3) {
               if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y + 1]) {
                  wumpusWorld.setSenseBreeze(true);
                  pitsAroundPlayer += 1;
               }
            }

            //Check for pit to the south
            if (wumpusWorld.getPlayerLocation().y > 0) {
               if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y - 1]) {
                  wumpusWorld.setSenseBreeze(true);
                  pitsAroundPlayer += 1;
               }
            }

            //If there isn't a pit around the player make sure the breeze percept isn't set
            if (pitsAroundPlayer === 0) {
               wumpusWorld.setSenseBreeze(false);
            }

            //Check for a wumpus
            wumpiiAroundPlayer = 0; //technically, this should never be more than 1.

            //Check for wumpus to the right
            if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x + 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
               wumpusWorld.setSenseStench(true);
               wumpiiAroundPlayer += 1;
            }
            //Check for wumpus to the left
            if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x - 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
               wumpusWorld.setSenseStench(true);
               wumpiiAroundPlayer += 1;
            }
            //Check for wumpus to the north
            if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y + 1) {
               wumpusWorld.setSenseStench(true);
               wumpiiAroundPlayer += 1;
            }
            //Check for wumpus to the south
            if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y - 1) {
               wumpusWorld.setSenseStench(true);
               wumpiiAroundPlayer += 1;
            }

            //Check for gold
            if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
               wumpusWorld.setSenseGlitter(true);
               wumpiiAroundPlayer += 1;
            } else {
               wumpusWorld.setSenseGlitter(false);
            }

            //If there isn't a stench around the player, make sure the percept isn't set
            if (wumpiiAroundPlayer === 0) {
               wumpusWorld.setSenseStench(false);
            }




            //*****************************************************************************
            //***********************Update page view accordingly**************************
            //*****************************************************************************

            //Correctly display the gameDescription.
            if (!wumpusWorld.getDisplayDescription()) {
               document.querySelector('#gameDescriptionBox').style.display = "none";
            }
            if (wumpusWorld.getDisplayDescription()) {
               document.querySelector('#gameDescriptionBox').style.display = "";
            }

            //Correctly display the high score.
            if (!wumpusWorld.getDisplayScore()) {
               document.querySelector('#high-score-box').style.display = "none";
            }
            if (wumpusWorld.getDisplayScore()) {
               document.querySelector('#high-score-box').style.display = "";
            }

            //Correctly display the AI
            if (!wumpusWorld.getDisplayAI()) {
               document.querySelector('#AI-box').style.display = "none";
            }
            if (wumpusWorld.getDisplayAI()) {
               document.querySelector('#AI-box').style.display = "";
            }

            //Correctly display the how-to-play section.
            if (!wumpusWorld.getDisplayHowToPlay()) {
               document.querySelector('#HowToPlay').style.display = "none";
            }
            if (wumpusWorld.getDisplayHowToPlay()) {
               document.querySelector('#HowToPlay').style.display = "";
            }

            //Correctly display the game board
            if (!wumpusWorld.getDisplayBoard()) {
               document.querySelector('#cave-area').style.display = "none";
            }
            if (wumpusWorld.getDisplayBoard()) {
               document.querySelector('#cave-area').style.display = "";
            }




            //*****************************************************************************
            //*****************************WIN, LOSE, or UPDATE****************************
            //*****************************************************************************

            //Check the model for game-over or win. Update the percept text
            if (wumpusWorld.getPlayerWin() || wumpusWorld.getPlayerLose()) {

               //Display win text
               if (wumpusWorld.getPlayerWin()) {
                  document.querySelector('#win-text').style.display = "";
                  document.querySelector('#score-text').textContent = "Total Score: " + wumpusWorld.getPlayerScore();
                  // loop through each of the boards rows.
                  Array.from(document.querySelectorAll('tr')).reverse().forEach(function (Row, whichRow) {
                     // loop through each of the rows' elements.
                     Array.from(Row.children).forEach(function (element, whichElement) {

                        // remove those elements.
                        Row.removeChild(element);

                     });

                     // then, fill them in with the final board state.
                     var i;
                     for(i = 0; i < 4; i++) {
                        // assume nothing is in the cell.
                        var cellReveal = "";
                        // if there is a wumpus in the cell, add 'W' to the string that will be placed.
                        if(wumpusWorld.getWumpusLocation().x == i && wumpusWorld.getWumpusLocation().y == whichRow) {
                           cellReveal += 'W';
                        }
                        //  if there is a pit in the cell, ad a 'P' to the string that will be placed.
                        var pitLocations = wumpusWorld.getIsPit();
                        if(pitLocations[i][whichRow]) {
                           cellReveal += 'P';
                        }

                        if(wumpusWorld.getGoldLocation().x == i && wumpusWorld.getGoldLocation().y == whichRow) {
                           cellReveal += 'G';
                        }
                        if (wumpusWorld.getPlayerLocation().x == i && wumpusWorld.getPlayerLocation().y == whichRow) {
                           cellReveal +='\n YOU';
                        }
                        // create the new td element
                        var tableData = document.createElement("td");
                        // create the apropriate text content for that element.
                        var tableDataContent = document.createTextNode(cellReveal);
                        // add the content to the newly created element.
                        tableData.appendChild(tableDataContent);

                        //insert the element to the current row.
                        Row.appendChild(tableData);
                     }

                  });
               } else {
                  document.querySelector('#win-text').style.display = "none";
               }

               //Display lose text
               if (wumpusWorld.getPlayerLose()) {
                  document.querySelector('#lose-text').style.display = "";
                  document.querySelector('#score-text').textContent = "Total Score: " + wumpusWorld.getPlayerScore();
                  // loop through each of the boards rows.
                  Array.from(document.querySelectorAll('tr')).reverse().forEach(function (Row, whichRow) {
                     // loop through each of the rows' elements.
                     Array.from(Row.children).forEach(function (element, whichElement) {

                        // remove those elements.
                        Row.removeChild(element);

                     });

                     // then, fill them in with the final board state.
                     var i;
                     for(i = 0; i < 4; i++) {
                        // assume nothing is in the cell.
                        var cellReveal = "";
                        // if there is a wumpus in the cell, add 'W' to the string that will be placed.
                        if(wumpusWorld.getWumpusLocation().x == i && wumpusWorld.getWumpusLocation().y == whichRow) {
                           cellReveal += 'W';
                        }
                        //  if there is a pit in the cell, ad a 'P' to the string that will be placed.
                        var pitLocations = wumpusWorld.getIsPit();
                        if(pitLocations[i][whichRow]) {
                           cellReveal += 'P';
                        }

                        if(wumpusWorld.getGoldLocation().x == i && wumpusWorld.getGoldLocation().y == whichRow) {
                           cellReveal += 'G';
                        }
                        if (wumpusWorld.getPlayerLocation().x == i && wumpusWorld.getPlayerLocation().y == whichRow) {
                           cellReveal +='\n YOU';
                        }
                        // create the new td element
                        var tableData = document.createElement("td");
                        // create the apropriate text content for that element.
                        var tableDataContent = document.createTextNode(cellReveal);
                        // add the content to the newly created element.
                        tableData.appendChild(tableDataContent);

                        //insert the element to the current row.
                        Row.appendChild(tableData);
                     }

                  });
               } else {
                  document.querySelector('#lose-text').style.display = "none";
               }
            } else {

               //Player didn't win or lose, keep going
               //Display AI text.
               document.querySelector('#AI-text').textContent = wumpusWorld.agentHollowKnight();
               //Display high score.
               document.querySelector('#high-score-text').textContent = wumpusWorld.getHighScore();
               //Since the game is ongoing, we should hide the win/lose text.
               document.querySelector('#win-text').style.display = "none";
               document.querySelector('#lose-text').style.display = "none";
               document.querySelector('#score-text').textContent = "";

               if (wumpusWorld.getSenseBump()) {
                  document.querySelector('#bump-percept-text').style.display = "";
               } else {
                  document.querySelector('#bump-percept-text').style.display = "none";
               }

               if (wumpusWorld.getSenseBreeze()) {
                  document.querySelector('#breeze-percept-text').style.display = "";
               } else {
                  document.querySelector('#breeze-percept-text').style.display = "none";
               }

               if (wumpusWorld.getSenseScream()) {
                  document.querySelector('#scream-percept-text').style.display = "";
               } else {
                  document.querySelector('#scream-percept-text').style.display = "none";
               }

               if (wumpusWorld.getSenseStench()) {
                  document.querySelector('#stench-percept-text').style.display = "";
               } else {
                  document.querySelector('#stench-percept-text').style.display = "none";
               }

               if (wumpusWorld.getSenseGlitter()) {
                  document.querySelector('#glitter-percept-text').style.display = "";
               } else {
                  document.querySelector('#glitter-percept-text').style.display = "none";
               }

               // if there are no percepts to be sensed, make it clear.
               if (!wumpusWorld.getSenseBump() && !wumpusWorld.getSenseBreeze() && !wumpusWorld.getSenseScream() && !wumpusWorld.getSenseStench() && !wumpusWorld.getSenseGlitter()) {
                  document.querySelector('#default-percept-text').style.display = "";
               } else {
                  document.querySelector('#default-percept-text').style.display = "none";
               }
            }
         };




         //*****************************************************************************
         //******************************UPDATE CONTROLLER******************************
         //*****************************************************************************


         //*****************************************************************************
         //********************************TOGGLE EVENTS********************************
         //*****************************************************************************

         //Setup description toggle
         document.querySelector('#game-description').addEventListener('click', function () {
            if (document.querySelector('#game-description').checked) {
               wumpusWorld.setDisplayDescription(true);
            } else {
               wumpusWorld.setDisplayDescription(false);
            }
            updateWumpusWorld();
         }, false);

         //Setup the gameboard toggle
         document.querySelector('#wumpusBoard').addEventListener('click', function () {
            if (document.querySelector('#wumpusBoard').checked) {
               wumpusWorld.setDisplayBoard(true);
            } else {
               wumpusWorld.setDisplayBoard(false);
            }
            updateWumpusWorld();
         }, false);

         //Setup how-to-play toggle
         document.querySelector('#how-to-play').addEventListener('click', function () {
            if (document.querySelector('#how-to-play').checked) {
               wumpusWorld.setDisplayHowToPlay(true);
            } else {
               wumpusWorld.setDisplayHowToPlay(false);
            }
            updateWumpusWorld();
         }, false);

         //Setup AI-toggle here
         document.querySelector('#ai-movement').addEventListener('click', function () {
            if (document.querySelector('#ai-movement').checked) {
               wumpusWorld.setDisplayAI(true);
            } else {
               wumpusWorld.setDisplayAI(false);
            }
            updateWumpusWorld();
         }, false);

         //Setup Scoreboard-toggle here
         document.querySelector('#scorebox').addEventListener('click', function () {
            if (document.querySelector('#scorebox').checked) {
               wumpusWorld.setDisplayScore(true);
            } else {
               wumpusWorld.setDisplayScore(false);
            }
            updateWumpusWorld();
         }, false);

         //Reset game on button-press.
         document.querySelector('#reset-button').addEventListener('click', function () {
            wumpusWorld.resetGame();

            // RESET BOARD VIEW WITH  CHECKBOXES. this should only be called
            // once, at the start of each round. currently its always called,
            // which resets the player's notepad/
            // ***************
            // go through each row
            document.querySelectorAll('tr').forEach(function (Row, whichRow) {
               // loop through each of the rows' elements.
               Array.from(Row.children).forEach(function (element, whichElement) {

                  // remove those elements.
                  Row.removeChild(element);

               });

               //create 4 series of checkboxes for each row.
               var i;
               for(i = 0; i < 4; i++) {

                     // create the start-box.
                     if(i == 0 && whichRow == 3) {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode('START'));
                        Row.appendChild(td);
                     } else {

                        // create the checkboxes with w
                        var tableData = document.createElement('td');
                        var checkbox = document.createElement('input');
                        checkbox.type = "checkbox";
                        var checkboxLabel = document.createElement('label');
                        checkboxLabel.appendChild(checkbox);
                        checkboxLabel.appendChild(document.createTextNode('W'));

                        // create checkbox for p.
                        var p = document.createElement('p');
                        var checkboxLable2 = document.createElement('label');
                        var checkbox2 = document.createElement('input');
                        checkbox2.type = "checkbox";


                        checkboxLable2.appendChild(checkbox2);
                        checkboxLable2.appendChild(document.createTextNode('P'));

                        tableData.appendChild(checkboxLabel);
                        tableData.appendChild(p);
                        tableData.appendChild(checkboxLable2);
                        Row.appendChild(tableData);
                     }
               }
            });



















            updateWumpusWorld();
         }, false);
         //*****************************************************************************




         //*****************************************************************************
         //**************************PLAYER MOVEMENT & ACTIONS**************************
         //*****************************************************************************
         document.addEventListener('keydown', function (keyCode) {

            //If the player hasn't won or lost yet, keep going
            if (!wumpusWorld.getPlayerWin() && !wumpusWorld.getPlayerLose()) {

               //Handle moving the player North
               if (keyCode.code === 'KeyW') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().y === 3) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y + 1);
                     wumpusWorld.setPushMovesMade('MoveUp');
                  }
               }

               //Handle moving the player West
               if (keyCode.code === 'KeyA') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 0) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x - 1, wumpusWorld.getPlayerLocation().y);
                     wumpusWorld.setPushMovesMade('MoveLeft');
                  }
               }

               //Handle moving the player South
               if (keyCode.code === 'KeyS') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x, wumpusWorld.getPlayerLocation().y - 1);
                     wumpusWorld.setPushMovesMade('MoveDown');
                  }
               }

               //Handle moving the player East
               if (keyCode.code === 'KeyD') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 3) {
                     wumpusWorld.setSenseBump(true);
                  } else {
                     wumpusWorld.setSenseBump(false);
                     wumpusWorld.setPlayerLocation(wumpusWorld.getPlayerLocation().x + 1, wumpusWorld.getPlayerLocation().y);
                     wumpusWorld.setPushMovesMade('MoveRight');
                  }
               }

               //Handle climbing out of the cavern
               if (keyCode.code === 'KeyC') {
                  wumpusWorld.setPlayerScore(-1);
                  if (wumpusWorld.getPlayerLocation().x === 0 && wumpusWorld.getPlayerLocation().y === 0) {
                     wumpusWorld.setPlayerWin(true);
                  }
               }

               //Handle picking up gold
               if (keyCode.code === 'KeyG') {
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
                     wumpusWorld.setPlayerHasGold();
                     wumpusWorld.setRemoveGold();
                     wumpusWorld.setSenseGlitter(false);
                  }
               }

               wumpusWorld.setSenseScream(false); //Wumpus is not dead initially

               //Handle shooting arrow North
               if (keyCode.code === 'ArrowUp') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y < wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100, -100);
                     wumpusWorld.setLastMoveMade('shootUp');
                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }

               //Handle shooting arrow South
               if (keyCode.code === 'ArrowDown') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getWumpusLocation().x && wumpusWorld.getPlayerLocation().y > wumpusWorld.getWumpusLocation().y) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100, -100);
                     wumpusWorld.setLastMoveMade('shootDown');
                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }

               //Handle shooting arrow West
               if (keyCode.code === 'ArrowLeft') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x > wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100, -100);
                     wumpusWorld.setLastMoveMade('shootLeft');
                  } else {
                     wumpusWorld.setSenseScream(false);
                  }
               }

               //Handle shooting arrow East
               if (keyCode.code === 'ArrowRight') {
                  wumpusWorld.setPlayerScore(-10);
                  wumpusWorld.setHasArrow(false);
                  if (wumpusWorld.getPlayerLocation().y === wumpusWorld.getWumpusLocation().y && wumpusWorld.getPlayerLocation().x < wumpusWorld.getWumpusLocation().x) {
                     wumpusWorld.setSenseScream(true);
                     wumpusWorld.setWumpusLocation(-100, -100);
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

               //Check for pit breeze, but only check existing squares.
               pitsAroundPlayer = 0;

               //Check for pit to the West
               if (wumpusWorld.getPlayerLocation().x < 3) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x + 1][wumpusWorld.getPlayerLocation().y]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer += 1;
                  }
               }

               //Check for pit to the East
               if (wumpusWorld.getPlayerLocation().x > 0) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x - 1][wumpusWorld.getPlayerLocation().y]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer += 1;
                  }
               }

               //Check for pit to the North
               if (wumpusWorld.getPlayerLocation().y < 3) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y + 1]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer += 1;
                  }
               }

               //Check for pit to the South
               if (wumpusWorld.getPlayerLocation().y > 0) {
                  if (tempPit[wumpusWorld.getPlayerLocation().x][wumpusWorld.getPlayerLocation().y - 1]) {
                     wumpusWorld.setSenseBreeze(true);
                     pitsAroundPlayer += 1;
                  }
               }

               //If there are no pits around the player, clear out the breeze percept
               if (pitsAroundPlayer === 0) {
                  wumpusWorld.setSenseBreeze(false);
               }

               //Check for Stench
               wumpiiAroundPlayer = 0; //technically, this should never be more than 1.

               //Check for wumpus to the right
               if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x + 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }

               //Check for wumpus to the left
               if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x - 1 && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }

               //Check for wumpus to the north
               if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y + 1) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }

               //Check for wumpus to the south
               if (wumpusWorld.getWumpusLocation().x === wumpusWorld.getPlayerLocation().x && wumpusWorld.getWumpusLocation().y === wumpusWorld.getPlayerLocation().y - 1) {
                  wumpusWorld.setSenseStench(true);
                  wumpiiAroundPlayer += 1;
               }

               //Check for gold
               if (wumpusWorld.getPlayerLocation().x === wumpusWorld.getGoldLocation().x && wumpusWorld.getPlayerLocation().y === wumpusWorld.getGoldLocation().y) {
                  wumpusWorld.setSenseGlitter(true);
                  wumpiiAroundPlayer += 1;
               } else {
                  wumpusWorld.setSenseGlitter(false);
               }

               //If there isn't a wumpus, clear out the stench percept
               if (wumpiiAroundPlayer === 0) {
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
