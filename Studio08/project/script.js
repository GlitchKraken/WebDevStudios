/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 8
// YOUR NAMES: Josh Meek, Chad Fry

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   (function () {
      var createTextKeeper;

      // WRITE YOUR createTextKeeper FUNCTION HERE
      //createTextKeeper function saves what is typed in a multiline
      //textbox and keeps track of changes between page loads
      createTextKeeper = function (oldState) {
         //Declare variables self and state
         var self, state;

         //Create a new state object that is the default state of the data
         state = {
            numChangesMade: 0, //Give numChangesMade property a value of 0
            savedText: '' //Give savedText property a empty string
         };

         //Try to parse oldState as a JSON string save result in state.
         //If oldState is not avlid JSON string, do not change the default state
         if (typeof oldState === 'string') {
            try {
               state = JSON.parse(oldState);
            } catch (ignore) {
            }
         }

         //Create the self object with four methods
         self = {
            getNumChangesMade: function () {
               return state.numChangesMade; //Return the number of changes made.
            },
            getSavedText: function () {
               return state.savedText; //Return the saved text
            },
            getState: function () {
               //Return a JSON string describing the state object
               return JSON.stringify(state);
            },
            saveNewText: function (newText) {
               //save newText as the new saved text and add 1 the number of changes
               state.savedText = newText;
               state.numChangesMade += 1;
            }
         };

         //Freeze the self object and return it
         return Object.freeze(self);
      };

      (function () {
         var textKeeper, updateTextKeeper;

         // WRITE YOUR updateTextKeeper FUNCTION HERE
         updateTextKeeper = function () {
            //Save the state in web storage if available
            if (localStorage && localStorage.setItem) {
               localStorage.setItem('CS 3312 Studio 8 sticky text', textKeeper.getState());
            }

            //Update the view
            document.querySelector('#text-input').value = textKeeper.getSavedText();
            document.querySelector('#text-changes-made').textContent = textKeeper.getNumChangesMade();

         };

         // WRITE CODE FOR THE CONTROLLER HERE
         document.querySelector('#text-input').oninput = function () {
            //Use oninput to update the saved text
            textKeeper.saveNewText(document.querySelector('#text-input').value);
            updateTextKeeper();

         };

         // WRITE CODE TO GET THINGS STARTED HERE
         //When the page is loaded retrieve any data and update the model
         textKeeper = createTextKeeper(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 Studio 8 sticky text'));
         updateTextKeeper();
      }());
   }());

   (function () {
      var createCounter;

      // WRITE YOUR createCounter FUNCTION HERE
      createCounter = function (oldState) {
         //Declare variables self and state
         var self, state;

         //Create a new state object that is the default state of the data
         state = {
            count: 1 //Give count property a value of 1
         };

         //Try to parse oldState as a JSON string save result in state.
         //If oldState is not avlid JSON string, do not change the default state
         if (typeof oldState === 'string') {
            try {
               state = JSON.parse(oldState);
            } catch (ignore) {
            }
         }

         //Create the self object with three methods
         self = {
            getCount: function () {
               return state.count; //Return the current count
            },
            getState: function () {
               return JSON.stringify(state); //Return JSON string describing the state object
            },
            increment: function (num) {
               state.count += num; //Increment the count
            }
         };

         //Freeze the self object and return it
         return Object.freeze(self);
      };


      (function () {
         var cardCounter, updateCards;

         // WRITE YOUR updateCards FUNCTION HERE
         updateCards = function () {

            // Save the new state in the web storage.
            if (localStorage && localStorage.setItem) {
               localStorage.setItem('CS 3312 Studio 8 card clicker', cardCounter.getState());
            }

            // Update the view by...

            // creating a variable for the cards element.
            var newElement, currentNum, cardsOutputElement = document.querySelector('#cards');

            // emptying it of children nodes.
            while (cardsOutputElement.hasChildNodes()) {
               cardsOutputElement.removeChild(cardsOutputElement.lastChild);
            }

            // ... and inserting the nums as a new div element one by one, from 1 to count.
            currentNum = 1;

            while (currentNum <= cardCounter.getCount()) {
               newElement = document.createElement('div');
               newElement.textContent = currentNum;
               cardsOutputElement.appendChild(newElement);
               currentNum += 1;
            }

            // Update the controller.
            Array.from(cardsOutputElement.querySelectorAll('div')).forEach(function (element, whichItem) {
               element.addEventListener('click', function () {
                  // add the numerical value of the element to count here.
                  cardCounter.increment(whichItem + 1);
                  // update the thing.
                  updateCards();
               }, false);
            });
         };

         // WRITE CODE FOR THE CONTROLLER HERE
         // Add stuff for reset button.
         document.querySelector('#reset-cards').addEventListener('click', function () {
            cardCounter = createCounter();
            updateCards();
         }, false);

         // WRITE CODE TO GET THINGS STARTED HERE
         cardCounter = createCounter(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 Studio 8 card clicker'));
         updateCards();
      }());
   }());
}, false);
