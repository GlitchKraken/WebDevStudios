/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 5
// YOUR NAMES: Joshua Meek, Chad Fry

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Each little web app is hidden from the others using an IIFE.
   (function () {
      var isPrime;

      // WRITE YOUR isPrime FUNCTION HERE
      isPrime = function isPrime (number) {
         if (typeof(number) === 'number' && isFinite(number)) {
            if(number < 2) {
               // all cases before 2 are not prime.
               return false;
            }
            for(var i = 2; i < number; i+=1) {
               if(number % i === 0) {
                  //then, we've found an i that divides number, it cannot be prime.
                  return false;
               }
            }
            //if we're here, we've looked at every number from 2 to number, and nothing divides it.
            return true;
         }
         else {
            // we were given an invalid entry.
            return false;
         }
      };

      // The report function is hidden from the isPrime function using an IIFE.
      (function () {
         var report;

         // WRITE YOUR report FUNCTION HERE
         report = function report (parameter) {
            if(typeof(parameter) === 'number' && isFinite(parameter) && isPrime(parameter)) {
               document.querySelector('#prime-or-not').textContent = 'prime';
            }
            else if(typeof(parameter) === 'number' && isFinite(parameter) && !isPrime(parameter)) {
               document.querySelector('#prime-or-not').textContent = 'not prime';
            }
            else {
               document.querySelector('#prime-or-not').textContent = 'not a number';
            }
         };
         // Call the report function even before there's a value to use.
         report();
         // When the number is changed at all, immediately . . .
         document.querySelector('#primality-input').addEventListener('input', function () {
            // . . . call the report function and pass it the user's value.
            report(parseInt(document.querySelector('#primality-input').value, 10));
         }, false);
      }());
   }());

   (function () {
      var fibonacci;

      // WRITE YOUR fibonacci FUNCTION HERE
      fibonacci = function fibonacci (n) {
         if (typeof(n) === 'number' && isFinite(n)) {
            n = Math.round(n); //Round n to the nearest integer

            //Base case. If n is 0, 1, or 2, return n
            if (n < 2 && n >= 0) {
               return n;
            } else if (n < 0){ //If n is a negative number
               return 0;
            }

            //Recursive step to find the fibonacci number
            return (fibonacci(n - 2) + fibonacci(n - 1));
         } else {
            return 0; //Failsafe, doesn't fall within other categories
         }
      }

      // Do things when the "Calculate it" button is clicked.
      document.querySelector('#calculate-fibonacci').addEventListener('click', function () {
         var whichFibonacciNumber;
         // Get the user's number.
         whichFibonacciNumber = parseInt(document.querySelector('#fibonacci-input').value, 10);
         // Use the fibonacci function to calculate the output.
         document.querySelector('#which-fibonacci-number').textContent = whichFibonacciNumber.toString();
         document.querySelector('#fibonacci-number').textContent = fibonacci(whichFibonacciNumber).toString();
      }, false);
   }());

   (function () {
      var rememberTotal;

      // WRITE YOUR rememberTotal FUNCTION HERE

      // Output the initial total.
      document.querySelector('#total-number').textContent = rememberTotal();
      // Update and output the total whenever the "Add it to the total" button is clicked.
      document.querySelector('#add-to-total').addEventListener('click', function () {
         rememberTotal(parseFloat(document.querySelector('#number-input').value));
         document.querySelector('#total-number').textContent = rememberTotal();
      }, false);
   }());

   (function () {
      var reverseString;

      // WRITE YOUR reverseString FUNCTION HERE

      (function () {
         var reversalInputElement;
         reversalInputElement = document.querySelector('#reversal-input');
         // When the user changes the string and focuses on another part of the page, reverse the new string.
         // Notice the difference between the 'change' event and the 'input' event.
         reversalInputElement.addEventListener('change', function () {
            reversalInputElement.value = reverseString(reversalInputElement.value);
         }, false);
      }());
   }());

   (function () {
      // If you like, write code here that will change the color of the square when the mouse interacts with it.
      // You may find the updateSquare function from the examples useful.
   }());

}, false);
