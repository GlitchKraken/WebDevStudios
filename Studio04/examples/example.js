/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Examples for Studio 4

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function() {

  'use strict'; // Enforce stricter JavaScript rules.

  // Do things when the user clicks the "Write a poem" button.
  document.querySelector('#write-poem').addEventListener('click', function() {
    var adjective, noun, poemString, verb;

    // Empty the output elements.
    document.querySelector('#poem-output').value = '';
    document.querySelector('#poem-error').textContent = '';

    // Get all three input strings.
    noun = document.querySelector('#noun-input').value;
    verb = document.querySelector('#verb-input').value.toLowerCase();
    adjective = document.querySelector('#adjective-input').value.toLowerCase();

    // Check the lengths of the three input strings.
    if (noun.length > 0 && verb.length > 0 && adjective.length > 0) {
      // If we got three words, build a poem from scratch out of them.
      // Use + to concatenate strings together.
      poemString = noun + ' ' + verb + '\n'; // \n gives a newline character.
      // Use += to concatenate a string to the end of our string.
      poemString += adjective + ' ' + noun + ' ' + verb + '\n';
      poemString += adjective + ' ' + noun + ' ' + verb + ' ' + noun + '\n';
      poemString += adjective + ' ' + noun + ' ' + verb + ' ' + adjective + ' ' + noun + '\n';
      poemString += verb + ' ' + noun + ' ' + verb.toUpperCase();
      document.querySelector('#poem-output').value = poemString;
    } else {
      // If any of the textboxes was empty, ask for more input.
      document.querySelector('#poem-error').textContent = 'Give me all three words if you want a poem!';
    }
  }, false);

  // Do things when the user clicks the "Roll the dice" button.
  document.querySelector('#roll-dice').addEventListener('click', function() {
    var diceString, diceTotal, dieRoll, numberOfDice, whichRoll;

    // Empty the output elements.
    document.querySelector('#dice-output').textContent = '';
    document.querySelector('#dice-error').textContent = '';

    // Use the parseInt function to convert the input to a base-10 integer.
    numberOfDice = parseInt(document.querySelector('#number-of-dice').value, 10);

    // Make sure the input number is a real number between 1 and 10.
    if (isFinite(numberOfDice) && numberOfDice >= 1 && numberOfDice <= 10) {
      // Initialize the dice total and the output string.
      diceTotal = 0;
      diceString = '';
      // Run the same code for each die.
      for (whichRoll = 0; whichRoll < numberOfDice; whichRoll += 1) {
        // Generate one random number between 1 and 6.
        dieRoll = Math.floor(Math.random() * 6) + 1;
        // Update the dice total and the output string.
        diceTotal += dieRoll;
        if (whichRoll > 0) {
          diceString += ' + ';
        }
        diceString += dieRoll.toString();
      }
      // For multiple dice, use the dice total to finish the output string.
      if (numberOfDice > 1) {
        diceString += ' = ' + diceTotal.toString();
      }
      // Output the result of the dice rolls.
      document.querySelector('#dice-output').textContent = diceString;
    } else {
      // Ask for an acceptable number of dice.
      document.querySelector('#dice-error').textContent = 'I need a number of dice between 1 and 10.';
    }
  }, false);

  // Do things when the user clicks the "Print those powers" button.
  document.querySelector('#show-powers').addEventListener('click', function() {
    var base, limit, nextNumber, whichPower;

    // Clear any old output.
    document.querySelector('#powers-output').value = '';

    // You can change these values to get different lists of powers.
    base = 3;
    limit = 1000000000;

    // Start at 1, the zeroth power of anything.
    nextNumber = 1;
    whichPower = 0;

    // Keep on going if still under the limit.
    while (nextNumber < limit) {
      // Output and then update.
      document.querySelector('#powers-output').value += base.toString() + '^' + whichPower.toString() + ' = ' + nextNumber.toString() + '\n';
      nextNumber *= base;
      whichPower += 1;
    }
  }, false);

  // Do things when the user clicks the "Draw a random map" button.
  document.querySelector('#draw-random-map').addEventListener('click', function() {
    var mapString, sizeOfMap, whichColumn, whichRow;

    // Use the parseInt function to convert the input to a base-10 integer.
    sizeOfMap = parseInt(document.querySelector('#size-of-map').value, 10);

    // Make sure the input number is a real positive number.
    if (isFinite(sizeOfMap) && sizeOfMap > 0) {
      mapString = '';
      // Go through each row and column and build mapString from scratch.
      for (whichRow = 0; whichRow < sizeOfMap; whichRow += 1) {
        if (whichRow > 0) {
          mapString += '\n';
        }
        for (whichColumn = 0; whichColumn < sizeOfMap; whichColumn += 1) {
          // Math.random() will give a random real number between 0 and 1.
          if (Math.random() < 0.4) {
            // 40% of the time, draw a mountain.
            mapString += '^';
          } else {
            // 60% of the time, draw a flat plain.
            mapString += '-';
          }
        }
      }
    } else {
      mapString = 'I need a positive number to draw a map.';
    }

    // Output the beautiful result.
    document.querySelector('#random-map-output').value = mapString;
  }, false);

  // Create a function and call it immediately.
  // This is a handy way to hide variables from the rest of the code.
  (function() {
    var goalNumber, numberSoFar;

    goalNumber = Math.floor(Math.random() * 50) + 23;
    document.querySelector('#goal-number').textContent = goalNumber.toString();
    numberSoFar = 1;
    document.querySelector('#number-so-far').textContent = numberSoFar.toString();
    document.querySelector('#math-game-message').textContent = 'Good luck!';

    document.querySelector('#mult-3').addEventListener('click', function() {
      numberSoFar *= 3;
      document.querySelector('#number-so-far').textContent = numberSoFar.toString();
      if (numberSoFar === goalNumber) {
        document.querySelector('#math-game-message').textContent = 'You win!';
      } else if (numberSoFar > goalNumber) {
        document.querySelector('#math-game-message').textContent = 'Too high.  Try restarting.';
      } else {
        document.querySelector('#math-game-message').textContent = 'Keep going . . .';
      }
    }, false);

    document.querySelector('#add-5').addEventListener('click', function() {
      numberSoFar += 5;
      document.querySelector('#number-so-far').textContent = numberSoFar.toString();
      if (numberSoFar === goalNumber) {
        document.querySelector('#math-game-message').textContent = 'You win!';
      } else if (numberSoFar > goalNumber) {
        document.querySelector('#math-game-message').textContent = 'Too high.  Try restarting.';
      } else {
        document.querySelector('#math-game-message').textContent = 'Keep going . . .';
      }
    }, false);

    document.querySelector('#restart-math-game').addEventListener('click', function() {
      goalNumber = Math.floor(Math.random() * 50) + 23;
      document.querySelector('#goal-number').textContent = goalNumber.toString();
      numberSoFar = 1;
      document.querySelector('#number-so-far').textContent = numberSoFar.toString();
      document.querySelector('#math-game-message').textContent = 'Good luck!';
    }, false);

  }());

}, false);
