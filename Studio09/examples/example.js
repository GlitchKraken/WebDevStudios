/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Examples for Studio 9

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Add functionality to the simple drawing area.
   (function () {
      var simpleDrawingCanvas, simpleDrawingContext, updateSimpleDrawingCanvas;

      // Get the canvas object and its two-dimensional rendering context.
      simpleDrawingCanvas = document.querySelector('#simple-drawing');
      simpleDrawingContext = simpleDrawingCanvas && simpleDrawingCanvas.getContext && simpleDrawingCanvas.getContext('2d');
      if (!simpleDrawingContext) {
         document.querySelector('#simple-drawing-instructions').textContent = 'Your browser does not seem to support the <canvas> element correctly; please use a recent version of a standards-compliant browser such as Opera, Chrome or Firefox.';
         return;
      }

      // Size the canvas.
      simpleDrawingCanvas.width = 500;
      simpleDrawingCanvas.height = 400;

      // Create a function that draws on the canvas.
      updateSimpleDrawingCanvas = function () {

         // Fill the canvas with black.
         simpleDrawingContext.fillStyle = 'rgb(0, 0, 0)';
         simpleDrawingContext.fillRect(0, 0, simpleDrawingCanvas.width, simpleDrawingCanvas.height);

         // Draw a four-sided polygon.
         simpleDrawingContext.beginPath();
         simpleDrawingContext.moveTo(50, 100);
         simpleDrawingContext.lineTo(50, 150 + Math.floor(Math.random() * 100));
         simpleDrawingContext.lineTo(100 + Math.floor(Math.random() * 100), 150 + Math.floor(Math.random() * 100));
         simpleDrawingContext.lineTo(100 + Math.floor(Math.random() * 100), 100);
         simpleDrawingContext.closePath();
         simpleDrawingContext.fillStyle = 'rgb(85, ' + Math.floor(85 + Math.random() * 86) + ', 170)';
         simpleDrawingContext.fill();

         // Draw a partially transparent line.
         simpleDrawingContext.lineWidth = 3;
         simpleDrawingContext.beginPath();
         simpleDrawingContext.moveTo(40 + Math.floor(Math.random() * 30), 40 + Math.floor(Math.random() * 30));
         simpleDrawingContext.lineTo(150 + Math.floor(Math.random() * 10), 150 + Math.floor(Math.random() * 10));
         simpleDrawingContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
         simpleDrawingContext.stroke();

         // Draw the outline of a sector of a circle.
         simpleDrawingContext.lineWidth = 1;
         simpleDrawingContext.beginPath();
         simpleDrawingContext.moveTo(100, 300);
         simpleDrawingContext.arc(100, 300, 50, 0, 5 * Math.PI / 3, false);
         simpleDrawingContext.closePath();
         simpleDrawingContext.strokeStyle = 'rgb(255, 255, 0)';
         simpleDrawingContext.stroke();

         // Draw a path that includes an arc of a circle.
         simpleDrawingContext.lineWidth = 5;
         simpleDrawingContext.lineCap = 'round';
         simpleDrawingContext.lineJoin = 'round';
         simpleDrawingContext.beginPath();
         simpleDrawingContext.moveTo(250, 300);
         simpleDrawingContext.arc(250, 300, 50, 0, 5 * Math.PI / 3, false);
         simpleDrawingContext.strokeStyle = 'rgb(170, 0, 170)';
         simpleDrawingContext.stroke();

         (function () {
            var randomAngle;
            // Draw a pie chart.
            randomAngle = 2 * Math.PI * Math.random();
            simpleDrawingContext.beginPath();
            simpleDrawingContext.moveTo(400, 300);
            simpleDrawingContext.arc(400, 300, 50, 3 * Math.PI / 2, randomAngle, false);
            simpleDrawingContext.fillStyle = 'rgb(0, 170, 85)';
            simpleDrawingContext.fill();
            simpleDrawingContext.beginPath();
            simpleDrawingContext.moveTo(400, 300);
            simpleDrawingContext.arc(400, 300, 50, 3 * Math.PI / 2, randomAngle, true);
            simpleDrawingContext.fillStyle = 'rgb(170, 0, 85)';
            simpleDrawingContext.fill();
         }());

         (function () {
            var controlPoints;

            // Define some control points for a Bezier curve.
            controlPoints = [
               {
                  color: 'rgb(255, 0, 0)',
                  x: 375,
                  y: 50
               }, {
                  color: 'rgb(85, 0, 255)',
                  x: 475,
                  y: 25 + Math.floor(Math.random() * 25)
               }, {
                  color: 'rgb(0, 85, 255)',
                  x: 400,
                  y: 75 + Math.floor(Math.random() * 100)
               }, {
                  color: 'rgb(0, 255, 0)',
                  x: 450,
                  y: 200
               }
            ];

            // Draw lines to show how the control points are being used.
            simpleDrawingContext.lineWidth = 1;
            simpleDrawingContext.beginPath();
            simpleDrawingContext.moveTo(controlPoints[0].x, controlPoints[0].y);
            simpleDrawingContext.lineTo(controlPoints[1].x, controlPoints[1].y);
            simpleDrawingContext.strokeStyle = 'rgb(170, 170, 170)';
            simpleDrawingContext.stroke();
            simpleDrawingContext.beginPath();
            simpleDrawingContext.moveTo(controlPoints[2].x, controlPoints[2].y);
            simpleDrawingContext.lineTo(controlPoints[3].x, controlPoints[3].y);
            simpleDrawingContext.strokeStyle = 'rgb(170, 170, 170)';
            simpleDrawingContext.stroke();

            // Draw the Bezier curve.
            simpleDrawingContext.lineWidth = 3;
            simpleDrawingContext.beginPath();
            simpleDrawingContext.moveTo(controlPoints[0].x, controlPoints[0].y);
            simpleDrawingContext.bezierCurveTo(controlPoints[1].x, controlPoints[1].y, controlPoints[2].x, controlPoints[2].y, controlPoints[3].x, controlPoints[3].y);
            simpleDrawingContext.strokeStyle = 'rgb(255, 255, 255)';
            simpleDrawingContext.stroke();

            // Draw the control points on top of the curve.
            controlPoints.forEach(function (controlPoint) {
               simpleDrawingContext.beginPath();
               simpleDrawingContext.arc(controlPoint.x, controlPoint.y, 5, 0, 2 * Math.PI, false);
               simpleDrawingContext.fillStyle = controlPoint.color;
               simpleDrawingContext.fill();
            });
         }());

         (function () {
            var x;
            // Draw a row of little rectangles with random colors.
            for (x = 120; x < 320; x += 4) {
               simpleDrawingContext.fillStyle = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
               simpleDrawingContext.fillRect(x, 40, 4, 20);
            }
         }());

         (function () {
            var blueLevel, centerPoint;
            // Draw some little squares and circles in random places.
            for (blueLevel = 0; blueLevel < 256; blueLevel += 17) {
               centerPoint = {
                  x: 250 + Math.floor(Math.random() * 100),
                  y: 100 + Math.floor(Math.random() * 100)
               };
               simpleDrawingContext.fillStyle = 'rgb(85, ' + (255 - blueLevel) + ', ' + blueLevel + ')';
               // Half the time, draw a square; half the time, draw a circle.
               if (Math.random() < 0.5) {
                  simpleDrawingContext.fillRect(centerPoint.x - 5, centerPoint.y - 5, 10, 10);
               } else {
                  simpleDrawingContext.beginPath();
                  simpleDrawingContext.arc(centerPoint.x, centerPoint.y, 5, 0, 2 * Math.PI, false);
                  simpleDrawingContext.fill();
               }
            }
         }());
      };

      // When the canvas is clicked, redraw it.
      simpleDrawingCanvas.addEventListener('click', updateSimpleDrawingCanvas, false);

      // Draw on the canvas.
      updateSimpleDrawingCanvas();
   }());

   // Add functionality to the responsive drawing area.
   (function () {
      var drawLatestLine, getPointFromEvent, lastPoint, responsiveDrawingCanvas, responsiveDrawingContext;

      // Get the canvas object and its two-dimensional rendering context.
      responsiveDrawingCanvas = document.querySelector('#responsive-drawing');
      responsiveDrawingContext = responsiveDrawingCanvas && responsiveDrawingCanvas.getContext && responsiveDrawingCanvas.getContext('2d');
      if (!responsiveDrawingContext) {
         document.querySelector('#responsive-drawing-instructions').textContent = 'Your browser does not seem to support the <canvas> element correctly; please use a recent version of a standards-compliant browser such as Opera, Chrome or Firefox.';
         return;
      }

      // Size the canvas.
      responsiveDrawingCanvas.width = 400;
      responsiveDrawingCanvas.height = 400;
      // Fill the canvas with blue.
      responsiveDrawingContext.fillStyle = 'rgb(0, 0, 85)';
      responsiveDrawingContext.fillRect(0, 0, responsiveDrawingCanvas.width, responsiveDrawingCanvas.height);

      // Create a function that finds the (x, y) point on responsiveDrawingCanvas given an event.
      getPointFromEvent = function (ev) {
         var rect;
         rect = responsiveDrawingCanvas.getBoundingClientRect();
         return {
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top
         };
      };

      // Create a function to draw the latest line segment as the mouse moves around.
      drawLatestLine = function (ev) {
         var currentPoint;
         currentPoint = getPointFromEvent(ev);
         responsiveDrawingContext.lineWidth = 2;
         responsiveDrawingContext.beginPath();
         responsiveDrawingContext.moveTo(lastPoint.x, lastPoint.y);
         responsiveDrawingContext.lineTo(currentPoint.x, currentPoint.y);
         responsiveDrawingContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
         responsiveDrawingContext.stroke();
         lastPoint = currentPoint;
      };

      // When the mouse clicks down, draw a red circle and set lines to draw on moving the mouse.
      responsiveDrawingCanvas.addEventListener('mousedown', function (ev) {
         lastPoint = getPointFromEvent(ev);
         document.querySelector('#responsive-drawing-status').textContent = 'down at (' + lastPoint.x + ', ' + lastPoint.y + ')';
         responsiveDrawingContext.fillStyle = 'rgb(255, 0, 0)';
         responsiveDrawingContext.beginPath();
         responsiveDrawingContext.arc(lastPoint.x, lastPoint.y, 5, 0, 2 * Math.PI, false);
         responsiveDrawingContext.fill();
         document.addEventListener('mousemove', drawLatestLine, false);
      }, false);

      // When the mouse is let up, draw a green circle and stop lines from drawing when the mouse is moved.
      document.addEventListener('mouseup', function (ev) {
         lastPoint = getPointFromEvent(ev);
         document.querySelector('#responsive-drawing-status').textContent = 'up at (' + lastPoint.x + ', ' + lastPoint.y + ')';
         responsiveDrawingContext.fillStyle = 'rgb(0, 255, 0)';
         responsiveDrawingContext.beginPath();
         responsiveDrawingContext.arc(lastPoint.x, lastPoint.y, 5, 0, 2 * Math.PI, false);
         responsiveDrawingContext.fill();
         document.removeEventListener('mousemove', drawLatestLine, false);
      }, false);
   }());

   // Add functionality to the color show area.
   (function () {
      var advanceColorShow, isColorShowActive, toggleColorShowButton;

      // At first, the color is not changing.
      isColorShowActive = false;

      // If the color should be changing, randomize it and then check again in half a second.
      advanceColorShow = function advanceColorShow() {
         if (isColorShowActive) {
            // Randomize the color.
            document.querySelector('#color-show').style.backgroundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
            // Set advanceColorShow to run again in 500 milliseconds (half a second).
            setTimeout(advanceColorShow, 500);
         }
      };

      // Handle the button that toggles the color show on and off.
      toggleColorShowButton = document.querySelector('#toggle-color-show');
      toggleColorShowButton.addEventListener('click', function () {
         // Flip the color show from off to on or from on to off.
         isColorShowActive = !isColorShowActive;
         // Make the button say the appropriate thing.
         toggleColorShowButton.textContent = isColorShowActive ? 'Stop color show' : 'Start color show';
         // Start the color show (which won't do anything if isColorShowActive is now false).
         advanceColorShow();
      }, false);
   }());

   // Add functionality to the "move over me" element.
   (function () {
      var fadeMore, moveOverMeElement, opacity, opacityIncrement;

      // Fade an element a little more.
      fadeMore = function fadeMore() {
         // Update the opacity for the new timer tick.
         opacity += opacityIncrement;
         // Make sure it doesn't go below 0 or above 1.
         opacity = Math.min(Math.max(opacity, 0), 1);
         // Give the element its new opacity.
         moveOverMeElement.style.opacity = opacity;
         // If the element is neither fully opaque nor fully transparent . . .
         if (opacity > 0 && opacity < 1) {
            // . . . rerun fadeMore after a delay.
            setTimeout(fadeMore, 10);
         }
      };

      // At first, the element is fully opaque.
      opacity = 1;

      // Handle moving in and out of the #move-over-me element.
      moveOverMeElement = document.querySelector('#move-over-me');
      moveOverMeElement.addEventListener('mouseenter', function () {
         // Decrease opacity with each timer tick.
         opacityIncrement = -0.01;
         // If fadeMore isn't already going, get it started.
         if (opacity >= 1) {
            fadeMore();
         }
      }, false);
      moveOverMeElement.addEventListener('mouseleave', function () {
         // Increase opacity with each timer tick.
         opacityIncrement = 0.01;
         // If fadeMore isn't already going, get it started.
         if (opacity <= 0) {
            fadeMore();
         }
      }, false);
   }());

   // Add functionality to the "click me" element.
   (function () {
      var clickMeElement, fadeDown;

      // Fade an element down a little further.
      fadeDown = function fadeDown(state) {
         // Make fadeDown unavailable until the whole fade-out is finished.
         fadeDown.isAvailableToRun = false;
         // Update the distance moved and apply it to the element.
         state.distance += state.distanceIncrement;
         state.element.style.top = state.distance + 'px';
         // Update the opacity and apply it to the element.
         state.opacity += state.opacityIncrement;
         state.element.style.opacity = state.opacity;
         if (state.opacity > 0) {
            // If the element is still showing, wait a bit and then continue fading it.
            setTimeout(function () {
               fadeDown(state);
            }, state.timeIncrement);
         } else {
            // When the element has faded out completely, pause . . .
            setTimeout(function () {
               // . . . and then let the initial CSS show through.
               state.element.style.opacity = '';
               state.element.style.top = '';
               // Then make fadeDown available again.
               fadeDown.isAvailableToRun = true;
            }, state.pause);
         }
      };

      // In JavaScript, functions are objects and can have their own properties.
      // Give the fadeDown function a property that acts as a mutual-exclusion lock.
      fadeDown.isAvailableToRun = true;

      // Handle clicking of the #click-me element.
      clickMeElement = document.querySelector('#click-me');
      clickMeElement.addEventListener('click', function () {
         if (fadeDown.isAvailableToRun) {
            // Call fadeDown, passing in an object that keeps track of the animation.
            fadeDown({
               distance: 0, // initial distance from start
               distanceIncrement: 1, // number of pixels to move each timer tick
               element: clickMeElement, // element to move and fade
               opacity: 1, // initial opacity
               opacityIncrement: -0.01, // how much to fade each timer tick
               pause: 1000, // milliseconds to pause after completed fade
               timeIncrement: 10 // milliseconds for each timer tick
            });
         }
      }, false);
   }());

}, false);
