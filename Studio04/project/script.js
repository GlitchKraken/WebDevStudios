/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 4
// YOUR NAMES: Chad Fry, Josh Meek

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  /* Example code given in-class!

   //Declare this function's local vars.
  var outputElement, num, whatever;

  // Save the output box in a var.
  outputElement = document.querySelector('#output'); //we can use querySelector to get ANYTHING :O

  //Empty the text in the output box.
  outputElement.value = '';

  // Calculate a number and save it in a variable
  num = 0.1 + 0.2;

  outputElement.value += num +  '\n';


  num = Number(outputElement.value);
  if(typeof num === 'number')
  {
      outputElement.value += num + ' is a string' + '\n';
      outputElement.value += num.toFixed(6) +  '\n';
  }


*/


  //Actual code goes down below.
  document.querySelector('#convert-f-to-c').addEventListener('click', function() {
    var fahrenheitVal, celsiusVal;

    //grab the value inside the fahrenheit box, but convert it to an int (by default it may be string).
    fahrenheitVal = parseInt(document.querySelector('#fahrenheit').textContent);
    //test outputting before we get to any serious work.
    document.querySelector('#celsius').value = 'The type of FV is: ' + typeof fahrenheitVal;
  }, false); //end of

}, false); //end main-listener
