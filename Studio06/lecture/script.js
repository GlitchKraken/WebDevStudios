/*jslint browser: true, indent: 3 */

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function() {
   'use strict'; // Enforce stricter JavaScript rules.

   // Declare this function's local variables.
   var outputElement, createPlayer, player;

   // Save the output box in a variable.
   outputElement = document.querySelector('#output');


   // Create an object with props.
   // you could also use [] instead of {}
   player = {
      firstName: 'Matt',
      lastName: 'Chapman',
      uniformNumber: 26,
      position: 5,
      onBaseAverage: 0.356
   };


   // this notation for objects also works!
   // new player object. the one above is deleted.
   player = {};
   player.firstName = 'Matt';
   player.lastName = 'Wizlef';
   player.uniformNumber = 26;
   player.position = 5;
   player.onBaseAverage = 0.356;

   player['onBaseAverage'] = 0.356; //also works! but... don't do it. please.

   // go through all its properties and print them out one by one.
   Object.keys(player).forEach(function(prop) {
      outputElement.value += prop + ': ' + player[prop] + '\n';
   });
   outputElement.value += '-------------\n';



   delete player.firstName;
   delete player.lastName;


   // notice that this time it simply doesn't print the non-existant props. after all, they don't exist!
   Object.keys(player).forEach(function(prop) {
      outputElement.value += prop + ': ' + player[prop] + '\n';
   });
   outputElement.value += '-------------\n';


   //attempting to retrieve a deleted propety will return undefined.
   player.name = {
      first: 'blah',
      last: 'nate'
   };


   // turn the object into a JSON string.

   outputElement.value += JSON.stringify(player) + '\n ------';
   outputElement.value += '\n';


   //fucntions!
   // try to print out the results of the player object's functions
   player.getFullName = function() {
      return player.name.first + ' ' + player.name.last;
   };

   outputElement.value += 'FULLNAME = ' + player.getFullName();



   // creating a factory function
   createPlayer = function(args) {
      var newPlayer;
      newPlayer = {
         firstName: '',
         lastName: '',
         uniformNumber: 4,
         position: 5,
         onBaseAverage: 0.356
      };

      Object.keys(newPlayer).forEach(function(prop) {
         if (args.hasOwnProperty(prop)) {
            newPlayer[prop] = args[prop];
         }
      });
      //return an immutable object
      return Object.freeze(newPlayer);
   };


// use an object for named parameters.
player = createPlayer({
   lastName: 'Carpenter',
   uniformNumber: 13,
   onBaseAverage: 0.374

});


}, false);
