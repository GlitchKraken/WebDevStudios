/*jslint browser: true, indent: 3 */

/*
CS 3312, Spring 2019
Final Project
Josh Meek & Chad Fry
*/

// Here's a generic web app that uses model/view/controller code organization and web storage.

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {

   'use strict';
   var createToDoList;

   // Create a factory that makes an object to keep track of a to-do list.
   createToDoList = function (oldState) {
      var self, state;

      // Create a default starting state.
      state = {
         list: []
      };
      // If there's a valid previous state, use it instead.
      if (typeof oldState === 'string') {
         try {
            state = JSON.parse(oldState);
         } catch (ignore) {
         }
      }

      // The self object contains public methods.
      self = {
         addItem: function (item) {
            // Add a new item to the end of the list.
            state.list.push(item);
         },
         getItem: function (whichItem) {
            // Return the desired item from the list.
            return state.list[whichItem];
         },
         getList: function () {
            // Return a copy of the list array.
            return state.list.slice();
         },
         getNumItems: function () {
            // Return the number of items in the list.
            return state.list.length;
         },
         getState: function () {
            // Return a string representation of the state object, to be used for web storage.
            return JSON.stringify(state);
         },
         removeItem: function (whichItem) {
            // Remove an item from anywhere in the list.
            state.list = state.list.slice(0, whichItem).concat(state.list.slice(whichItem + 1));
         }
      };
      // Normally it's best to freeze the self object to keep it from being modified later.
      return Object.freeze(self);
   };

   // Create a new closure to hide the view and controller from the model code above.
   (function () {
      var toDoList, updateToDoList;

      // Create a function that updates everything that needs updating whenever the model changes.
      updateToDoList = function () {
         var toDoListOutputElement;

         // Save the new state in web storage (if available).
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('CS 3312 generic web app', toDoList.getState());
         }

         // Update the view.
         toDoListOutputElement = document.querySelector('#to-do-list-output');
         // Empty the #to-do-list-output element of all child elements.
         while (toDoListOutputElement.hasChildNodes()) {
            toDoListOutputElement.removeChild(toDoListOutputElement.lastChild);
         }
         // Insert the list items as new li elements one by one.
         toDoList.getList().forEach(function (item) {
            var newElement;
            // Create a new li element in HTML and insert it just inside the end of the list.
            newElement = document.createElement('li');
            newElement.textContent = item;
            toDoListOutputElement.appendChild(newElement);
         });

         // Update the controller:  Add a click handler to each new li element.
         Array.from(toDoListOutputElement.querySelectorAll('li')).forEach(function (element, whichItem) {
            element.addEventListener('click', function () {
               // Update the model.
               toDoList.removeItem(whichItem);
               // Update everything else based on the new model state.
               updateToDoList();
            }, false);
         });
      };

      // Set up the controller:  Handle adding a new to-do list item.
      document.querySelector('#add-to-do-list-item').addEventListener('click', function () {
         var itemToAdd;
         // Update the model.
         itemToAdd = document.querySelector('#to-do-list-item-to-add').value;
         if (itemToAdd.length > 0) {
            toDoList.addItem(itemToAdd);
         }
         // Update everything else based on the new model state.
         updateToDoList();
      }, false);

      // When the page is loaded, get any saved state from web storage and use it.
      toDoList = createToDoList(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 generic web app'));
      // Update everything else based on the new model state.
      updateToDoList();
   }());
}, false);
