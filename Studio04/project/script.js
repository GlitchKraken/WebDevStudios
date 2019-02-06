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



  }, false);



}, false); //end main-listener
