/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Examples for Studio 7

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Do things when the user clicks the "Experiment with arrays" button.
   document.querySelector('#run-experiments').addEventListener('click', function () {
      var array, getArrayInfoString, inputString, outputString;

      outputString = '';

      // A function to print the contents of an array.
      getArrayInfoString = function (a) {
         var infoString;
         infoString = '';

         // Use the forEach method to go through all the elements in an array.
         a.forEach(function (value, index) {
            // Inside this little function, value is the value of the current element
            // and index is its index, starting at 0.
            infoString += index + ': ' + value + '\n';
         });
         infoString += 'length = ' + a.length + '\n';
         infoString += '---\n';
         return infoString;
      };

      // Create a new array using array literal notation.
      // An array can hold values of any type.
      array = [3, 'howdy', true, {prop: 'value'}, 3.14];
      outputString += getArrayInfoString(array);

      // Create a new empty array and add elements one by one.
      array = [];
      array[0] = 3; // The index of the first element is 0, not 1.
      array[1] = 'howdy';
      array[2] = true;
      array[3] = {prop: 'value'};
      array[4] = 3.14;
      outputString += getArrayInfoString(array);

      // Values in an array can be accessed and changed directly.
      array[0] = 43;
      outputString += getArrayInfoString(array);

      // Use the push method to add an element to the end of an array.
      array.push(76);
      outputString += getArrayInfoString(array);

      // Use the pop method to take an element off the end of an array.
      outputString += 'value popped off: ' + array.pop() + '\n';
      outputString += getArrayInfoString(array);
      // The push and pop methods let you use an array like a stack.

      // Use the shift method to take an element off the beginning of an array.
      outputString += 'value shifted off: ' + array.shift() + '\n';
      outputString += getArrayInfoString(array);
      // The push and shift methods let you use an array like a queue.

      // A string's split method can be used to create an array of strings.
      inputString = 'this is a sentence of words';
      array = inputString.split(' '); // Separate by space characters.
      outputString += getArrayInfoString(array);

      // The join method can create a string out of elements.
      outputString += array.join(' / ') + '\n';
      outputString += array.join() + '\n'; // A comma is used by default.
      outputString += array.join('') + '\n';
      outputString += '---\n';

      // The slice method returns a subarray of an array.
      array = array.slice(1, 5); // Start at index 1 and end before index 5.
      outputString += getArrayInfoString(array);

      // The concat method creates a new bigger array out of two smaller ones.
      array = array.concat([12, 34, 56]);
      outputString += getArrayInfoString(array);

      // Using slice and concat together can help you delete elements from an array.
      array = array.slice(0, 3).concat(array.slice(4));
      // Now the array is the same as before but with element 3 deleted.
      outputString += getArrayInfoString(array);

      // Create a new array of numbers.
      array = [43, 98, 9, 3, 76, 12];
      outputString += 'before sorting:\n';
      outputString += getArrayInfoString(array);

      // By default, the sort method assumes all elements are strings.
      array.sort();
      outputString += 'after default sort:\n';
      outputString += getArrayInfoString(array);

      // Give the sort method a compare function to sort numerically.
      array.sort(function (a, b) {
         return a - b;
      });
      outputString += 'after numerical sort:\n';
      outputString += getArrayInfoString(array);

      // The reverse method reverses the entire array in place.
      array.reverse();
      outputString += 'after reversing:\n';
      outputString += getArrayInfoString(array);

      // A while loop is useful for initializing an array to have a particular size.
      // Make a new empty array.
      array = [];
      // While it still has fewer elements than you want, . . .
      while (array.length < 10) {
         // . . . add another element to it.
         array.push(0);
      }
      // Then the array is full of 10 zeros.
      outputString += getArrayInfoString(array);

      // To create a multidimensional array, use an array of arrays.
      array = [
         ['X', 'X', 'O'],
         ['O', 'O', 'X'],
         ['X', 'O', 'X']
      ];
      outputString += getArrayInfoString(array);

      // Since each element is an array, you can use nested forEach loops.
      array.forEach(function (row, whichRow) {
         row.forEach(function (cell, whichColumn) {
            outputString += 'row ' + whichRow + ', column ' + whichColumn + ': ' + cell + '\n';
         });
      });
      outputString += '---\n';

      // Another way to format that output:
      array.forEach(function (row, whichRow) {
         outputString += 'row ' + whichRow + ':\n';
         row.forEach(function (cell, whichColumn) {
            outputString += '   column ' + whichColumn + ': ' + cell + '\n';
         });
      });
      outputString += '---\n';

      // You can also initialize multiple dimensions using while loops.
      (function () {
         var row;
         // Make a new empty array.
         array = [];
         // While it still has fewer rows than you want, . . .
         while (array.length < 5) {
            // . . . add another row to it.
            // Make a new empty row.
            row = [];
            // While it still has fewer elements than you want, . . .
            while (row.length < 5) {
               // . . . add another element to it.
               row.push(0);
            }
            // Add the completed row to the array.
            array.push(row);
         }
      }());
      // Then the 5x5 array is full of zeros.
      outputString += getArrayInfoString(array);

      // Let's see all that output.
      document.querySelector('#experiment-output').value = outputString;

   }, false);

   // Do things when the "Calculate its factorial" button is clicked.
   document.querySelector('#calculate-factorial').addEventListener('click', function () {
      var factorial, inputNumber, outputNumber;

      // Use an IIFE to create a memoized factorial function that saves results in an array as it finds them.
      factorial = (function () {
         var factorialResults;

         // Initialize the array so that factorial(0) is 1.
         factorialResults = [1];

         // A function has access to variables in the function in which it is created.
         return function f(n) {
            // Make sure that n is an integer.
            n = Math.round(n);
            // n needs to be a nonnegative number to calculate a factorial.
            if (typeof n === 'number' && isFinite(n) && n >= 0) {
               // If the result has never been calculated before, . . .
               if (!factorialResults.hasOwnProperty(n)) {
                  // . . . calculate the new result recursively and save it in the array.
                  factorialResults[n] = n * f(n - 1);
               }
               // Either way, return the saved result.
               return factorialResults[n];
            }
            // If the input was bad, return the value undefined.
            return undefined;
         };
      }());

      // Get the user's number.
      inputNumber = parseInt(document.querySelector('#factorial-input').value, 10);
      // Use the factorial function to calculate the output.
      outputNumber = factorial(inputNumber);
      if (typeof outputNumber === 'number' && isFinite(outputNumber)) {
         document.querySelector('#factorial-output').value += inputNumber.toString() + '! = ' + outputNumber.toString() + '\n';
      } else {
         document.querySelector('#factorial-output').value += 'I need a nonnegative integer (not too big!).\n';
      }
   }, false);

   (function () {
      var dieElements;

      // Get an array of all div elements inside the #dice element.
      dieElements = Array.from(document.querySelectorAll('#dice div'));

      // Go through each of those div elements one by one.
      dieElements.forEach(function (dieElement, whichDie) {
         // Inside this function, dieElement is the current element and whichDie is its index.

         // Set the value of the current die when the page loads.
         dieElement.textContent = whichDie + 1;

         // Create an event handler that rerolls the die randomly whenever it is clicked.
         dieElement.addEventListener('click', function () {
            dieElement.textContent = Math.floor(Math.random() * 6) + 1;
         }, false);
      });
   }());

   (function () {
      var digitElements, numberBuilt;

      // Get an array of all div elements inside the #numerical-input element.
      digitElements = Array.from(document.querySelectorAll('#numerical-input div'));
      numberBuilt = 0;

      // Go through each of those div elements one by one.
      digitElements.forEach(function (digitElement, whichDigit) {
         // Inside this function, digitElement is the current element and whichDigit is its index.

         // Set the value of the current digit when the page loads.
         digitElement.textContent = whichDigit;

         // Create an event handler that adds the digit to the end whenever it is clicked.
         digitElement.addEventListener('click', function () {
            numberBuilt *= 10;
            numberBuilt += whichDigit;
            document.querySelector('#numerical-output').textContent = numberBuilt.toString() + ' base 10 = ' + numberBuilt.toString(2) + ' base 2';
         }, false);
      });
   }());

   (function () {
      var matrixElements, matrixValues;
      matrixElements = [];
      matrixValues = [];

      // Get an array of all the tr elements in the matrix and iterate through them.
      Array.from(document.querySelectorAll('#lights tr')).forEach(function (row) {
         var rowElements, rowValues;

         // Get an array of all the td elements in the current row.
         rowElements = Array.from(row.querySelectorAll('td'));

         // Build an array of 0 values the same size as the current row.
         rowValues = [];
         rowElements.forEach(function () {
            rowValues.push(0);
         });

         // Build the arrays of elements and values row by row.
         matrixElements.push(rowElements);
         matrixValues.push(rowValues);
      });

      // Go through each td element in the matrix, row by row.
      matrixElements.forEach(function (row, whichRow) {
         row.forEach(function (element, whichColumn) {
            // Inside this function, we have a td element and we know which row and which column it's in.

            // Output the initial value to the element.
            element.textContent = matrixValues[whichRow][whichColumn];

            // Create an event handler for the current element.
            element.addEventListener('click', function () {
               // Flip the element's green light on or off.
               element.classList.toggle('on');
               // Add 1 to the value of the element.
               matrixValues[whichRow][whichColumn] += 1;
               // Output the new value to the element.
               element.textContent = matrixValues[whichRow][whichColumn];
            }, false);
         });
      });
   }());

}, false);
