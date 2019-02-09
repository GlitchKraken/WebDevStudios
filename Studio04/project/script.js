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
      //If the value is not a nonnegative number, tell the user to input a new number
      document.querySelector('#star-box-output').value = 'I need a number to draw a box.';
    }

  }, false); //End of "Draw the box"



  // *** The user clicked "Hailstone it" ***
  document.querySelector('#print-hailstone').addEventListener('click', function() {
    //Variable to hold the number to Hailstone
    var numToChange, length, outputString;
    outputString = ""; //Start with an empty string
    // for anything to be executed, we need at LEAST one number.
    length = 1;

    //Grab the value inside the box to get the hailstone number.
    numToChange = parseInt(document.querySelector('#starting-number').value);

    //Check to make sure the number is a positive integer
    if (isFinite(numToChange) && numToChange > 0) {
      // keep going until we reach 1. or we're outright given 1.
      while (numToChange !== 1) {
        //before doing anything, output the original number
        outputString += numToChange + "\n";
        //Condition if numToChange is even
        if ((numToChange % 2) === 0) {
          numToChange = (numToChange / 2);
        } else {
          //Condition if numToChange is odd
          numToChange = ((numToChange * 3) + 1);
        }
        length += 1;
      }
      //if we're here, then numToChange MUST === 1. add it to the output string.
      outputString += numToChange;

      outputString += '\n' + 'Length = ' + length; //Output the total number of numbers hailstoned
      document.querySelector('#hailstone-output').value = outputString;
    } else {
      document.querySelector('#hailstone-output').value = 'I need a number to start with.';
    }

  }, false); //end of "hailstone-click"




  // *** The user clicked "Draw the boxes" ***
  document.querySelector('#draw-star-boxes').addEventListener('click', function() {
    //Variables for the dimensions of the box
    var boxDimensions, row, col, boxOutput;

    // we may need this! was suggested we calculate this and use it.
    var nearestEdgeDistance;
    var distanceFromTop, distanceFromBottom, distanceFromLeft, distanceFromRight;

    // Initialize vars to sigil values.
    distanceFromTop = -1;
    distanceFromLeft = -1;
    distanceFromRight = -1;
    distanceFromBottom = -1;
    nearestEdgeDistance = -1;
    //Grab the value inside the box to get the size of the boxes
    boxDimensions = parseInt(document.querySelector('#size-of-outer-box').value);

    // ensure valid user input before drawing box.
    if (isFinite(boxDimensions) && boxDimensions >= 0) {
      boxOutput = '';
      //Loop through the rows and columns.
      for (row = 0; row < boxDimensions; row += 1) {
        for (col = 0; col < boxDimensions; col += 1) {

          //calculate the current distance from each side.
          distanceFromTop = row;
          distanceFromLeft = col;
          distanceFromRight = ((boxDimensions - 1) - col);
          distanceFromBottom = ((boxDimensions - 1) - row);

          // assume the top is the closest side, and check the rest for confirmation.
          nearestEdgeDistance = distanceFromTop;

          // if anything has a shorter distance than the "nearest" side, assign that side as nearest.
          if (distanceFromLeft < nearestEdgeDistance) {
            nearestEdgeDistance = distanceFromLeft;
          }

          if (distanceFromRight < nearestEdgeDistance) {
            nearestEdgeDistance = distanceFromRight;
          }

          if (distanceFromBottom < nearestEdgeDistance) {
            nearestEdgeDistance = distanceFromBottom;
          }
          // shortest distance is now currently in nearestEdgeDistance

          // if nearestEdgeDistance is EVEN_NUM -> output a "*"
          if (nearestEdgeDistance % 2 === 0) {
            boxOutput += '*';
          } else {
            boxOutput += ' '; //  if nearestEdgeDistance is ODD_NUM -> output a " "
          }


        } // end col for loop
        boxOutput += '\n'; //Move to the next row, make sure to print a new line.
      } // end row for loop

      //Output the design

      document.querySelector('#star-boxes-output').value = boxOutput;

    } else {
      document.querySelector('#star-boxes-output').value = 'I need a number to draw boxes.';
    }

  }, false); //End of "Draw the boxes"

}, false); //end main-listener
