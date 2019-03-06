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
         var priv, self;

       //Create priv, an object with a empty object, toDoList
         priv = {
            toDoList: {}
         };

      //Create the object "self" with three methods
         self = {
            addItem: function (item) {
               if (typeof item === 'string') {
                  //save item to toDoList, with name converted to all lowercase, and value === item.
                  priv.toDoList[item.toLowerCase()] = item; //works... but it uses the forbidden syntax
                  //toDoList.toLowerCase(item) = item; //doesn't?
               }
            },
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
         var uniqueLetters, result;
         result = ''; //Make sure result is an empty string

         //Convert "inputString" to all uppercase
         inputString = inputString.toUpperCase();

         //Create an empty object uniqueLetters with no properties
         uniqueLetters = {};

         //Look through each character one by one
         inputString.split('').forEach(function (charValue) {
            if (/^[A-Z]$/.test(charValue)) {
               uniqueLetters[charValue] = true;
            }
         });

         Object.keys(uniqueLetters).forEach(function (charValue) {
            result += charValue;
         });

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
      alert("Running createCodeBook!");
      createCodeBook = function () {
         var priv, self;

         //Create priv, an object with a empty object property, codebook
         priv = {
            codebook: {}
         };

         //Create the object "self" with four methods
         self = {
            add: function (codeword, meaning) {
               if (typeof codeword === 'string') {
               //save codeword to codebook, with name codeword and value meaning
                  priv.codebook[codeword] = meaning;
               }
            },
            //this function is broken, somehow.
            isCodeword: function (codeword) {
               alert("inside isCodeWord!");
               if (priv.codebook.hasOwnProperty(codeword)) {
                  alert("returned true!");
                  return true;
               }
               alert("returned false!");
               return false;
            },
            retrieve: function (codeword) {
               alert("retrieve function callled!");
               if (codebook.isCodeword(codeword)) {
                  alert("codeword itself returned");
                  return priv.codebook[codeword];
               }
               alert("meaningless was returned");
               return '[meaningless]';
            },
            toString: function () {
               var string;
               string = '';

               Object.keys(priv.codebook).forEach(function (codeword) {
                  string += codeword + ": " + priv.codebook[codeword] + '\n';
               });

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
