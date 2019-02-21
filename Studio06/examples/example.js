/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Examples for Studio 6

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Do things when the user clicks the "Experiment with objects" button.
   document.querySelector('#run-experiments').addEventListener('click', function () {
      var createObj, obj1, obj2, outputString;

      outputString = '';

      // Make an object factory (kind of like a constructor).
      createObj = function () {
         var priv, self;

         // The priv object can hold all private data and code.
         priv = {
            artist: 'Explosions in the Sky'
         };

         // The self object can hold all public data and code.
         self = {
            getArtist: function () {
               return priv.artist;
            },
            title: 'The Earth Is Not a Cold Dead Place',
            year: 2003,
            toString: function () {
               // Return a string that describes the object.
               return priv.artist + ': ' + self.title + ' (' + self.year + ')';
               // Notice that self's methods can use both priv and self.
            }
         };

         return self;
      };

      obj1 = createObj();
      // obj1 now has a title property.
      outputString += 'obj1.title: ' + obj1.title + '\n';
      // We can't see or change its artist "property" directly . . .
      outputString += 'obj1.artist: ' + obj1.artist + '\n';
      // . . . but we can see it though the getArtist method.
      outputString += 'obj1.getArtist(): ' + obj1.getArtist() + '\n';
      outputString += '---\n';

      // Go through all its properties and print them out one by one.
      Object.keys(obj1).forEach(function (prop) {
         outputString += 'obj1.' + prop + ': ' + obj1[prop] + '\n';
      });
      // Every object has a hasOwnProperty method that tells you whether it has a given property.
      outputString += "obj1.hasOwnProperty('artist'): " + obj1.hasOwnProperty('artist') + '\n';
      outputString += "obj1.hasOwnProperty('title'): " + obj1.hasOwnProperty('title') + '\n';
      outputString += '---\n';

      obj2 = createObj();
      // obj1 and obj2 have the same properties with the same values.
      outputString += 'obj1.getArtist() === obj2.getArtist(): ' + (obj1.getArtist() === obj2.getArtist()) + '\n';
      outputString += 'obj1.title === obj2.title: ' + (obj1.title === obj2.title) + '\n';
      outputString += 'obj1.year === obj2.year: ' + (obj1.year === obj2.year) + '\n';
      // But they are different objects.
      outputString += 'obj1 === obj2: ' + (obj1 === obj2) + '\n';
      outputString += '---\n';

      // Use the toString method to print the objects.
      outputString += 'obj1.toString(): ' + obj1.toString() + '\n';
      // The toString method is called automatically to convert the object to a string.
      outputString += 'obj2: ' + obj2 + '\n';

      // An object's properties can be changed directly.
      obj2.title = 'All of a Sudden I Miss Everyone';
      obj2.year = 2007;
      outputString += 'obj2: ' + obj2 + '\n';

      document.querySelector('#experiment-output').value = outputString;
   }, false);

   (function () {
      var soccerGame, soccerScoreElement;
      soccerScoreElement = document.querySelector('#soccer-score');

      // Create an object using an object literal.
      soccerGame = {
         scoreA: 0,
         scoreB: 0
      };
      // Everything in the soccerGame object is visible and mutable.

      // The code below uses and changes the soccerGame object directly.
      soccerScoreElement.textContent = 'A ' + soccerGame.scoreA + ', B ' + soccerGame.scoreB;
      document.querySelector('#soccer-score-for-a').addEventListener('click', function () {
         soccerGame.scoreA += 1;
         soccerScoreElement.textContent = 'A ' + soccerGame.scoreA + ', B ' + soccerGame.scoreB;
      }, false);
      document.querySelector('#soccer-score-for-b').addEventListener('click', function () {
         soccerGame.scoreB += 1;
         soccerScoreElement.textContent = 'A ' + soccerGame.scoreA + ', B ' + soccerGame.scoreB;
      }, false);
      document.querySelector('#reset-soccer-game').addEventListener('click', function () {
         soccerGame.scoreA = 0;
         soccerGame.scoreB = 0;
         soccerScoreElement.textContent = 'A ' + soccerGame.scoreA + ', B ' + soccerGame.scoreB;
      }, false);
      // Notice how much code above was repeated.
      // Notice also that the score could have been changed to anything at any time.
   }());

   (function () {
      var createHockeyGame, hockeyGame, hockeyScoreElement;
      hockeyScoreElement = document.querySelector('#hockey-score');

      // Make an object factory to create hockey game objects.
      createHockeyGame = function () {
         var priv, self;

         // Store the score of the game privately.
         priv = {
            scoreA: 0,
            scoreB: 0
         };

         // Provide public methods.  They have access to the private data.
         self = {
            scoreGoalForA: function () {
               priv.scoreA += 1;
            },
            scoreGoalForB: function () {
               priv.scoreB += 1;
            },
            getScoreA: function () {
               return priv.scoreA;
            },
            getScoreB: function () {
               return priv.scoreB;
            },
            toString: function () {
               return 'A ' + priv.scoreA + ', B ' + priv.scoreB;
            }
         };

         // Return the object with useful methods.
         return Object.freeze(self);
         // We "freeze" the self object to keep its properties from being changed later.
         // The priv object is made safe by being hidden; the self object is made safe by being frozen.
      };

      // Use the factory to create a hockey game object.
      hockeyGame = createHockeyGame();

      // The code below uses and changes the hockeyGame object only through its methods.
      hockeyScoreElement.textContent = hockeyGame;
      document.querySelector('#hockey-score-for-a').addEventListener('click', function () {
         hockeyGame.scoreGoalForA();
         hockeyScoreElement.textContent = hockeyGame;
      }, false);
      document.querySelector('#hockey-score-for-b').addEventListener('click', function () {
         hockeyGame.scoreGoalForB();
         hockeyScoreElement.textContent = hockeyGame;
      }, false);
      document.querySelector('#reset-hockey-game').addEventListener('click', function () {
         hockeyGame = createHockeyGame();
         hockeyScoreElement.textContent = hockeyGame;
      }, false);
      // Notice that the score can only be changed in certain allowed ways.
      // Notice also how straightforward this code is to read and understand.
   }());

   (function () {
      var toDoList;

      // Create an object to keep track of a to-do list.
      toDoList = {};
      // This object is used directly by the code below.

      document.querySelector('#add-to-do-list-item').addEventListener('click', function () {
         var item;
         item = document.querySelector('#to-do-list-item-to-add').value;
         // Add the entered item to the to-do list, using its lowercase version as a key.
         toDoList[item.toLowerCase()] = item;
         // Print out the whole list.
         document.querySelector('#to-do-list-output').value = '';
         Object.keys(toDoList).forEach(function (prop) {
            document.querySelector('#to-do-list-output').value += toDoList[prop] + '\n';
         });
      }, false);

      document.querySelector('#remove-to-do-list-item').addEventListener('click', function () {
         var item;
         item = document.querySelector('#to-do-list-item-to-remove').value;
         // Delete the entered item from the to-do list (if it exists).
         delete toDoList[item.toLowerCase()];
         // Print out the whole list.
         document.querySelector('#to-do-list-output').value = '';
         Object.keys(toDoList).forEach(function (prop) {
            document.querySelector('#to-do-list-output').value += toDoList[prop] + '\n';
         });
      }, false);
   }());

   (function () {
      var findLetterCounts;

      findLetterCounts = function (inputString) {
         var letterCounts;
         // Change all letters in inputString to upper case.
         inputString = inputString.toUpperCase();
         // Create an empty object with no counts yet.
         letterCounts = {};
         // Look through each character in inputString one by one.
         inputString.split('').forEach(function (charValue) {
            // Make sure charValue is an uppercase letter between A and Z.
            if (/^[A-Z]$/.test(charValue)) {
               if (letterCounts.hasOwnProperty(charValue)) {
                  // We've seen charValue before; add one to its count.
                  letterCounts[charValue] += 1;
               } else {
                  // We're seeing charValue for the first time; start a new count.
                  letterCounts[charValue] = 1;
               }
            }
         });
         // Return an object full of letter counts.
         // For example, if inputString is 'ABA', the returned object will be {A: 2, B: 1}.
         return letterCounts;
      };

      document.querySelector('#count-the-letters').addEventListener('click', function () {
         var letterCounts, word;
         // Read in a word and count all the different letters in it.
         word = document.querySelector('#letter-counter-input').value;
         letterCounts = findLetterCounts(word);
         // Output a count for each letter found.
         document.querySelector('#letter-counter-output').value = '';
         Object.keys(letterCounts).forEach(function (charValue) {
            document.querySelector('#letter-counter-output').value += charValue + ': ' + letterCounts[charValue] + '\n';
         });
      }, false);
   }());

}, false);
