/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 4
// YOUR NAMES:

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   //Declare this function's local vars.
  var outputElement, num, whatever;

  // Save the output box in a var.
  outputElement = document.querySelector('#output');

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
  // .toUpperCase() will uppercase strings.


// Count up from 0 to 9
num = 0;
while(num < 10) {
  outputElement.value += num.toString() + '\n';
  num+=1;
}

for(num = 0; num < 10; num += 1) {
  outputElement.value += num.toString() + '\n';
}
outputElement.value += 'DONE:' + num.toString() + '\n';


}, false);
