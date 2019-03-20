/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 7
// YOUR NAMES: Josh Meek, Chad Fry

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Do things when the "Calculate it" button is clicked.
   document.querySelector('#calculate-fibonacci').addEventListener('click', function () {
      var fibonacci, whichFibonacciNumber;

      // WRITE YOUR fibonacci FUNCTION HERE
      fibonacci = (function () {

         // create the fibonacci array.
         var fibonacciResults = [];
         // set the first two values in-stone.
         fibonacciResults[0] = 0;
         fibonacciResults[1] = 1;

         return function f(n) {

            // round n to the nearest whole number.
            n = Math.round(n);

            //make sure that n is a valid number.
            if(isFinite(n) && n >= 0) {
               // have we already calculated this number?
               if(fibonacciResults.hasOwnProperty(n)) {
                  // yup, so return it.
                  return fibonacciResults[n];
               }
               else {
                  // otherwise, calculate it recursively,
                  // making sure to save the result!
                  fibonacciResults[n] = (f(n-1) + f(n-2));
                  return fibonacciResults[n];
               }
            }
            else {
               return 0;
            }
         };
      }());

      // Get the user's number.
      whichFibonacciNumber = parseInt(document.querySelector('#fibonacci-input').value, 10);
      // Use the fibonacci function to calculate the output.
      document.querySelector('#which-fibonacci-number').textContent = whichFibonacciNumber;
      document.querySelector('#fibonacci-number').textContent = fibonacci(whichFibonacciNumber);
   }, false);

   (function () {
      var dieElements;

      // Get an array of all div elements inside the #dice element and put them
      // in the variable dieElements.
      dieElements = Array.from(document.querySelectorAll('#dice div'));

      // Go through each div element one by one.
      dieElements.forEach(function (die, dieIndex) {
         //For this function, die is the current element being looked at, and dieIndex
         //is its index.

         //Set the value of the current die when the page loads.
         die.textContent = Math.floor(Math.random() * 6) + 1;

         //Create an event handler that rerolls the die when clicked, and all the ones to the
         //left of it.
         die.addEventListener('click', function() {
            //Rerolls the die clicked
            die.textContent = Math.floor(Math.random() * 6) + 1;

            //Rerolls all the die to the left of the one clicked
            dieElements.forEach(function (dieToChange, indexOfDie) {
               //If the die index is one to the left of the one clicked, reroll it
               if (indexOfDie < dieIndex) {
                  dieToChange.textContent = Math.floor(Math.random() * 6) + 1;
               }
            });
         }, false);
      });
   }());

   (function () {
      var cardElements, cardValues;

      // Get an array of all div elements inside the #cards element and put them
      // in the variable cardElements.
      cardElements = Array.from(document.querySelectorAll('#cards div'));

      //Initialize cardValues as an empty array.
      cardValues = [];

      //Go through the cards one by one
      cardElements.forEach(function (card, cardIndex) {
         //card is the element, cardIndex is its index

         //Set the value of the current card when the page loads.
         card.textContent = Math.floor(Math.random() * 99) + 1;

         //Also store the value into cardValues Array
         cardValues.push(card.textContent);
      });

      //Event handler for "Sort" button
      document.querySelector('#sort-cards').addEventListener('click', function (){
         //Sort the cardValues array numerically
         cardValues.sort(function(x, y) {
            return x - y;
         });

         //Go through and output each card after sorting
         cardElements.forEach(function (card, cardIndex) {
            //Set the new value of the card to the value
            //of its index in the card values array.
            card.textContent = cardValues[cardIndex];
         });
      }, false);

      //Event handler for "Reverse" button
      document.querySelector('#reverse-cards').addEventListener('click', function (){
         //Reverse the array in place
         cardValues.reverse();

         //Go through and output each card after reversing
         cardElements.forEach(function (card, cardIndex) {
            //Set the new value of the card to the value
            //of its index in the card values array.
            card.textContent = cardValues[cardIndex];
         });
      }, false);
   }());

   (function () {
      var nextToMove, ticTacToeElements, ticTacToeValues;

      // WRITE CODE HERE TO MAKE THE #tic-tac-toe ELEMENT WORK

   }());

}, false);
