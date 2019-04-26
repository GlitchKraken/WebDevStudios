/*jslint browser: true, indent: 3 */

/*
CS 3312, Spring 2019
Final Project
Josh Meek & Chad Fry
*/

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';
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
         for(x = 0; x < 4; x++) {
            for(y = 0; y < 4; y++) {
               if(x === 0 && y === 0) {
                  // always make sure spawn is not a pit.
                  state.isPit[x][y] = false;
               } else {
                  // generate a random num between 0 and 4 inclusive (so each num has 20% chance)
                  // here I pick 3 arbitrarily.
                  // if we generate 3, then that pit gets enabled.
                  if(Math.floor(Math.random() * 5) === 3) {
                     isPit[x][y] = true;
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
         perceptText: '',
         playerScore: 0,
         playerWin: false,
         playerLose: false
      };

      // shuffle everything up for the beginning of the round.
      // (I looked at the example from studio-8, doing this only effects
      // newgames. refreshes)
      randomizeWumpusBoard();
      //Probably don't need this. Each cavern should have a default state

      //If there is a valid previous state, use it instead.
      if (typeof oldState === 'string') {
         try {
            state = JSON.parse(oldState);
         } catch (ignore) {
         }
      }


      //The self object contains public methods
      self = {

         getPlayerLocation: function () {
            return state.playerLocation; //Return the player location
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
         setPercept: function (newText) {
            state.perceptText = newText; //Set the new percept
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
         shootArrow: function () {

         }

      };

      //Freeze the self object, so it can't be modified.
      return Object.freeze(self);
   };

   //Create a new closure to hide the view and controller from the model code above.
   (function () {
      //Stuff here
   }());




   //***********************EXAMPLE CODE BELOW*********************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************
   //**************************************************************************




   // Create a new closure to hide the view and controller from the model code above.
   (function () {
      var toDoList, updateToDoList;

      // Create a function that updates everything that needs updating whenever the model changes.
      updateToDoList = function () {
         var toDoListOutputElement;

         // Save the new state in web storage (if available).
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('CS 3312 generic web app', toDoList.getState());
         }

         // Update the view.
         toDoListOutputElement = document.querySelector('#to-do-list-output');
         // Empty the #to-do-list-output element of all child elements.
         while (toDoListOutputElement.hasChildNodes()) {
            toDoListOutputElement.removeChild(toDoListOutputElement.lastChild);
         }
         // Insert the list items as new li elements one by one.
         toDoList.getList().forEach(function (item) {
            var newElement;
            // Create a new li element in HTML and insert it just inside the end of the list.
            newElement = document.createElement('li');
            newElement.textContent = item;
            toDoListOutputElement.appendChild(newElement);
         });

         // Update the controller:  Add a click handler to each new li element.
         Array.from(toDoListOutputElement.querySelectorAll('li')).forEach(function (element, whichItem) {
            element.addEventListener('click', function () {
               // Update the model.
               toDoList.removeItem(whichItem);
               // Update everything else based on the new model state.
               updateToDoList();
            }, false);
         });
      };

      // Set up the controller:  Handle adding a new to-do list item.
      document.querySelector('#add-to-do-list-item').addEventListener('click', function () {
         var itemToAdd;
         // Update the model.
         itemToAdd = document.querySelector('#to-do-list-item-to-add').value;
         if (itemToAdd.length > 0) {
            toDoList.addItem(itemToAdd);
         }
         // Update everything else based on the new model state.
         updateToDoList();
      }, false);

      // When the page is loaded, get any saved state from web storage and use it.
      toDoList = createToDoList(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 generic web app'));
      // Update everything else based on the new model state.
      updateToDoList();
   }());
}, false);
