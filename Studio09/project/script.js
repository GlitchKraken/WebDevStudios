/*jslint browser: true, indent: 3 */

// CS 3312, spring 2019
// Studio 9
// YOUR NAMES: Josh Meek and Chad Fry

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Add functionality to the sketchy area.
   (function () {
      var sketchyCanvas, sketchyContext, updateSketchyCanvas;

      // Get the canvas object and its two-dimensional rendering context.
      sketchyCanvas = document.querySelector('#sketchy');
      sketchyContext = sketchyCanvas && sketchyCanvas.getContext && sketchyCanvas.getContext('2d');
      if (!sketchyContext) {
         return;
      }

      // Size the canvas.
      sketchyCanvas.width = 360;
      sketchyCanvas.height = 360;

      // WRITE YOUR updateSketchyCanvas FUNCTION HERE
      updateSketchyCanvas = function () {
         var controlPoints;

         // Make the black outline of the canvs.
         sketchyContext.fillStyle = 'rgb(0,0,0)';
         sketchyContext.fillRect(0, 0, sketchyCanvas.width, sketchyCanvas.height);

         // Fill the canvs with white.
         sketchyContext.fillStyle = 'rgb(255,255,255)';
         sketchyContext.fillRect(1, 1, 358, 358);

         // Draw the green sideways L shape
         sketchyContext.lineWidth = 1;
         sketchyContext.beginPath();
         sketchyContext.moveTo(50,50);
         sketchyContext.lineTo(63,50);
         sketchyContext.lineTo(63, 80);
         sketchyContext.lineTo(120, 80);
         sketchyContext.lineTo(120, 93);
         sketchyContext.lineTo(50, 93);
         sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(0,190,0)';
         sketchyContext.fill();

         // Draw the red L outline
         sketchyContext.lineWidth = 2;
         sketchyContext.beginPath();
         sketchyContext.moveTo(50,120);
         sketchyContext.lineTo(63,120);
         sketchyContext.lineTo(63, 150);
         sketchyContext.lineTo(120, 150);
         sketchyContext.lineTo(120, 163);
         sketchyContext.lineTo(50, 163);
         sketchyContext.closePath();
         sketchyContext.strokeStyle = 'rgb(160,0,0)';
         sketchyContext.stroke();


         // Begin the circle-drawing thing.

         // Blue quadrant.
         sketchyContext.beginPath();
         sketchyContext.moveTo(80, 290);
         sketchyContext.arc(80, 290, 60, 0, 3 * Math.PI / 2, true);
         //sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(0,0,255)';
         sketchyContext.fill();

         // Yellow quadrant/
         sketchyContext.beginPath();
         sketchyContext.moveTo(80, 290);
         sketchyContext.arc(80, 290, 60, Math.PI, 3 * Math.PI / 2, false);
         sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(255,255,0)';
         sketchyContext.fill();

         // Red quadrant
         sketchyContext.beginPath();
         sketchyContext.moveTo(80, 290);
         sketchyContext.arc(80, 290, 60, Math.PI, 1 * Math.PI / 2, true);
         sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(255,0,0)';
         sketchyContext.fill();


         // Green quadrant
         sketchyContext.beginPath();
         sketchyContext.moveTo(80, 290);
         sketchyContext.arc(80, 290, 60, 0, 1 * Math.PI / 2, false);
         //sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(0,255,0)';
         sketchyContext.fill();


         //Draw a medium-black circle.
         sketchyContext.lineWidth = 1;
         sketchyContext.beginPath();
         sketchyContext.moveTo(80, 290);
         sketchyContext.arc(80, 290, 20, 0, 2 * Math.PI , false);
         //sketchyContext.closePath();
         sketchyContext.fillStyle = 'rgb(0, 0, 0)';
         sketchyContext.fill();


         // draw the outline
         sketchyContext.lineWidth = 3;
         sketchyContext.moveTo(80, 290);
         sketchyContext.beginPath();
         sketchyContext.arc(80, 290, 60, 0, 2 * Math.PI, false);
         sketchyContext.strokeStyle = 'rgb(0,0,0)';
         sketchyContext.stroke();
         //sketchyContext.stroke();


         // end of circle drawing thing.




         // Begin Drawing the Bezier curve.

         // but first, define its control points.

         controlPoints = [
            {
               // starting point
               x: 300,
               y: 80
            }, {
               // first pulling point.
               x: 80,
               y: 60
            }, {
               // second pulling point.
               x: 450,
               y: 340
            }, {
               // finish point
               x: 250,
               y: 330
            }
         ];

         sketchyContext.lineWidth = 9;
         sketchyContext.lineCap = 'round';
         sketchyContext.lineJoin = 'round';
         sketchyContext.beginPath();
         sketchyContext.moveTo(controlPoints[0].x, controlPoints[0].y);
         sketchyContext.bezierCurveTo(controlPoints[1].x, controlPoints[1].y, controlPoints[2].x, controlPoints[2].y, controlPoints[3].x, controlPoints[3].y);
         sketchyContext.strokeStyle = 'rgb(0, 0, 190)';
         sketchyContext.stroke();


      };

      // Draw on the canvas.
      updateSketchyCanvas();
   }());

   // Add functionality to the Voronoi area.
   (function () {
      var generatingPoints, getPointFromEvent, updateVoronoiDiagram, voronoiCanvas, voronoiContext;

      // Get the canvas object and its two-dimensional rendering context.
      voronoiCanvas = document.querySelector('#voronoi');
      voronoiContext = voronoiCanvas && voronoiCanvas.getContext && voronoiCanvas.getContext('2d');
      if (!voronoiContext) {
         document.querySelector('#voronoi-instructions').textContent = 'Your browser does not seem to support the <canvas> element correctly; please use a recent version of a standards-compliant browser such as Opera, Chrome or Firefox.';
         return;
      }

      // Size the canvas.
      voronoiCanvas.width = 360;
      voronoiCanvas.height = 360;
      // Fill the canvas with black.
      voronoiContext.fillStyle = 'rgb(0, 0, 0)';
      voronoiContext.fillRect(0, 0, voronoiCanvas.width, voronoiCanvas.height);

      // At first we have no generating points.
      generatingPoints = [];

      // WRITE YOUR getPointFromEvent FUNCTION HERE

      // WRITE YOUR updateVoronoiDiagram FUNCTION HERE

      // When the canvas is clicked, add a generating point and redraw the Voronoi diagram.
      voronoiCanvas.addEventListener('click', function (ev) {
         generatingPoints.push(getPointFromEvent(ev));
         updateVoronoiDiagram();
      }, false);
   }());

   // Add functionality to the ripples area.
   (function () {
      var drawRipple, ripplesCanvas, ripplesContext;

      // Get the canvas object and its two-dimensional rendering context.
      ripplesCanvas = document.querySelector('#ripples');
      ripplesContext = ripplesCanvas && ripplesCanvas.getContext && ripplesCanvas.getContext('2d');
      if (!ripplesContext) {
         document.querySelector('#ripples-instructions').textContent = 'Your browser does not seem to support the <canvas> element correctly; please use a recent version of a standards-compliant browser such as Opera, Chrome or Firefox.';
         return;
      }

      // Size the canvas.
      ripplesCanvas.width = 360;
      ripplesCanvas.height = 360;

      // Fill the canvas with a dark color.
      ripplesContext.fillStyle = 'rgb(0, 17, 51)';
      ripplesContext.fillRect(0, 0, ripplesCanvas.width, ripplesCanvas.height);

      // WRITE YOUR drawRipple FUNCTION HERE

      // When the mouse is moved over the canvas, animate an expanding and fading ripple.
      ripplesCanvas.addEventListener('click', function (ev) {
         var rect;
         rect = ripplesCanvas.getBoundingClientRect();
         drawRipple({
            opacity: 1, // initial opacity
            opacityIncrement: -0.01, // how much to fade each timer tick
            radius: 0, // initial radius of ripple
            radiusIncrement: 1, // number of pixels to increase radius each timer tick
            timeIncrement: 10, // milliseconds for each timer tick
            x: ev.clientX - rect.left, // x coordinate of center of ripple
            y: ev.clientY - rect.top // y coordinate of center of ripple
         });
      }, false);
   }());

}, false);
