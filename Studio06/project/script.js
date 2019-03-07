/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 6
// YOUR NAMES: Chad Fry, Josh Meek

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   (function () {
      var createToDoList, toDoList;


    // WRITE YOUR createToDoList FUNCTION HERE
    //**************************************************
      createToDoList = function () {
         //Declare variables priv and self
         var priv, self;

       //Create priv, an object with a empty object, toDoList
         priv = {
            toDoList: {}
         };

      //Create the object "self" with three methods
         self = {
            //Method to add an item to the toDoList
            addItem: function (item) {
               if (typeof item === 'string') {
                  //save item to toDoList, with name converted to all lowercase, and value === item.
                  priv.toDoList[item.toLowerCase()] = item; //works... but it uses the forbidden syntax
                  //toDoList.toLowerCase(item) = item; //doesn't?
               }
            },
            //Method to remove an item from toDoList
            removeItem: function (item) {
               delete priv.toDoList[item.toLowerCase()];
            },
            toString: function () {
               var listString;
               listString = '';

               Object.keys(priv.toDoList).forEach(function (prop) {
                  //go through each property of the toDoList
                  //and output each item to the To-do box
                  listString += priv.toDoList[prop] + '\n';
               });

               //Return the new toDoList
               return listString;
            }
         };

         //freeze the object "self", and return it.
         return Object.freeze(self);
      };
    //***************************************************

    // Create a new object that keeps track of a to-do list.
      toDoList = createToDoList();

      document.querySelector('#add-to-do-list-item').addEventListener('click', function () {
         // Add a new to-do list item and output the new to-do list.
         toDoList.addItem(document.querySelector('#to-do-list-item-to-add').value);
         document.querySelector('#to-do-list-output').value = toDoList.toString();
      }, false);

      document.querySelector('#remove-to-do-list-item').addEventListener('click', function () {
         // Remove a to-do list item and output the new to-do list.
         toDoList.removeItem(document.querySelector('#to-do-list-item-to-remove').value);
         document.querySelector('#to-do-list-output').value = toDoList.toString();
      }, false);
   }());

   (function () {
      var findUniqueLetters;
      // WRITE YOUR findUniqueLetters FUNCTION HERE
      //**************************************************
      //Create findUniqueLetters function with one parameter, inputString
      findUniqueLetters = function (inputString) {
         //Declare variables
         var uniqueLetters, result;
         result = ''; //Make sure result is an empty string

         //Convert "inputString" to all uppercase
         inputString = inputString.toUpperCase();

         //Create an empty object uniqueLetters with no properties
         uniqueLetters = {};

         //Look through each character one by one and add the unique letters
         inputString.split('').forEach(function (charValue) {
            if (/^[A-Z]$/.test(charValue)) {
               uniqueLetters[charValue] = true;
            }
         });

         //Get the properties from uniqueLetters (the unique letters) and add it to the string
         Object.keys(uniqueLetters).forEach(function (charValue) {
            result += charValue;
         });

         //Return the string of unique letters
         return result;
      };
      //***************************************************

      document.querySelector('#find-unique-letters').addEventListener('click', function () {
         // Filter the characters in the textbox, leaving only the first of each letter found.
         var wordElement;
         wordElement = document.querySelector('#unique-letters-word');
         wordElement.value = findUniqueLetters(wordElement.value);
      }, false);
   }());

   (function () {
      var codebook, createCodeBook;

      // WRITE YOUR createCodeBook FUNCTION HERE
      //**************************************************
      createCodeBook = function () {
         //Declare variables
         var priv, self;

         //Create priv, an object with a empty object property, codebook
         priv = {
            codebook: {}
         };

         //Create the object "self" with four methods
         self = {
            //Method to add a code and meanting to the codebook
            add: function (codeword, meaning) {
               if (typeof codeword === 'string') {
               //save codeword to codebook, with name codeword and value meaning
                  priv.codebook[codeword] = meaning;
               }
            },
            //Method to see if the codeword is already in the codebook
            isCodeword: function (codeword) {
               if (priv.codebook.hasOwnProperty(codeword)) {
                  return true;
               }
               return false;
            },
            //Method to retrieve the codeword meaning
            retrieve: function (codeword) {
               if (codebook.isCodeword(codeword)) {
                  return priv.codebook[codeword];
               }
               return '[meaningless]';
            },
            //Method to put the codeword and meaning into a toString
            //to output to the textbox
            toString: function () {
               var string;
               string = '';

               //Make a string with all the codewords and their meaning
               Object.keys(priv.codebook).forEach(function (codeword) {
                  string += codeword + ": " + priv.codebook[codeword] + '\n';
               });

               //Output the codebook
               return string;
            }
         };

         //freeze the object "self", and return it.
         return Object.freeze(self);
      };
      //***************************************************

      // Create a new object that keeps track of a codebook.
      codebook = createCodeBook();

      document.querySelector('#save-codeword').addEventListener('click', function () {
         // Add a new codeword/meaning pair to the codebook.
         codebook.add(document.querySelector('#codeword-input').value, document.querySelector('#meaning-input').value);
      }, false);

      document.querySelector('#get-meaning').addEventListener('click', function () {
         // Output a codeword's meaning.
         document.querySelector('#codebook-output').value = codebook.retrieve(document.querySelector('#codeword-input').value);
      }, false);

      document.querySelector('#print-codebook').addEventListener('click', function () {
         // Output all codeword/meaning pairs already in the codebook.
         document.querySelector('#codebook-output').value = codebook.toString();
      }, false);

      document.querySelector('#clear-codebook').addEventListener('click', function () {
         // Create a new, empty codebook object.
         codebook = createCodeBook();
         // Empty the output textbox.
         document.querySelector('#codebook-output').value = '';
      }, false);
   }());

}, false);
