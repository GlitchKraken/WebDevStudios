/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 4
// YOUR NAMES: Chad Fry, Josh Meek


// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // *** The user has clicked "convert fahrenheit to celsius" ***
  document.querySelector('#convert-f-to-c').addEventListener('click', function() {
    var fahrenheitVal, celsiusVal;

    // grab the value inside the fahrenheit box, but convert it to a float (by default it may be string).
    fahrenheitVal = parseFloat(document.querySelector('#fahrenheit').value, 10);

    // calculate the correct value for celsius, to 3 decimal places. formula was online.
    celsiusVal = ((fahrenheitVal - 32) * (5.0 / 9.0)).toFixed(3);

    // catch cases where the user gave something that wasn't a number
    if (isNaN(celsiusVal)) {
      document.querySelector('#celsius').value = 'Bad input.';
    } else {
      document.querySelector('#celsius').value = celsiusVal; //only convert valid nums.
    }

  }, false); //end of "convert fahrenheit to celsius"

  // *** The user has clicked "convert celsius to fahrenheit" ***
  document.querySelector('#convert-c-to-f').addEventListener('click', function() {
    var fahrenheitVal, celsiusVal;

    // grab the value inside the celsius box, convert it to a float.
    celsiusVal = parseFloat(document.querySelector('#celsius').value, 10);

    //calculate the correct value for fahrenheit, to 3 decimal places.
    fahrenheitVal = (celsiusVal * (9.0 / 5.0) + 32).toFixed(3);

    // catch cases where the user gave something that wasn't a number
    if (isNaN(fahrenheitVal)) {
      document.querySelector('#fahrenheit').value = 'Bad input.';
    } else {
      document.querySelector('#fahrenheit').value = fahrenheitVal; // put the value inside the text-box
    }

   }, false); //end of "convert celsius to fahrenheit"

   // *** The user clicked "Draw the box" ***
   document.querySelector('#draw-star-box').addEventListener('click', function() {
      //Variables for the dimensions of the box
      var boxDimensions, row, col, boxOutput;

      //Grab the value inside the box to get the size of the boxes
      boxDimensions = document.querySelector('#size-of-box').value;

      if (isFinite(boxDimensions) && boxDimensions >= 0) {
         boxOutput = ""; //Clear out the box area so it is empty

         //Loop through the rows and columns "drawing" asterisks
         for (row = 0; row < boxDimensions; row += 1) {
            for (col = 0; col < boxDimensions; col += 1) {
               if (row === 0 || col === 0) {
                  boxOutput += '*';
               } else if (row !== boxDimensions && col === boxDimensions - 1) {
                  boxOutput += '*';
               } else if (col !== boxDimensions && row === boxDimensions - 1) {
                  boxOutput += '*';
               } else {
                  boxOutput += " ";
               }
            }
            boxOutput += '\n'; //Move to the next row
         }

         //Output the design
         document.querySelector('#star-box-output').value = boxOutput;

      } else {
         //If the value is a nonnegative number, tell the user to input a new number
         document.querySelector('#star-box-output').value = 'I need a number to draw a box.';
      }

   }, false); //End of "Draw the box"



}, false); //end main-listener
