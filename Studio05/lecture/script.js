/*jslint browser: true, indent: 3 */

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function() {
  'use strict'; // Enforce stricter JavaScript rules.

  // Declare this function's local variables.
  var f2, f3, f5, outputElement;

  // Save the output box in a variable.
  outputElement = document.querySelector('#output');

  // Do JavaScript things below, sending output to outputElement like this:
  // outputElement.value += 'Howdy!\n';


  //create a function with name f1 and save it in variable f2.
  f2 = function f1(x) {
    if (x === undefined) {
      return '; done wtih ' + f1.name;
    }
    return x + f1();
  };

  // make f3 refer tot eh same function.
  f3 = f2;

  //Try to use f1, f2, f3.
//  outputElement.value += f1('calling f1') + '\n';
  outputElement.value += f2('calling f2') + '\n';
  outputElement.value += f3('calling f3') + '\n';
  outputElement.value += "f2's name: " + f2.name + '\n';

  // since this function has the wird () guys, it runs and puts its value into f5.
  // f5 gets the little function.
  f5 = (function () {
    var v = 0;
    return function f4 () {
      v +=1;
      return v;
    };
  }());
outputElement.addEventListener('click', function () {
    outputElement.value += 'f5(): ' + f5() + '\n';
});

(function () {
  var f6, v;
  v = 'old';
  f6 = function () {
    return v;
  };

  v = 'new';
  outputElement.value += 'v: ' + v + '\n';
  outputElement.value += 'f6: ' + f6 + '\n';
  outputElement.value += 'f6(): ' + f6() + '\n';
}());


//loop without a loop
(function countDownFrom(n) {
  if( n >= 0) {
    outputElement.value += 'n: ' + n + '\n';
    countDownFrom(n - 1);
  }

}(9));



}, false);
