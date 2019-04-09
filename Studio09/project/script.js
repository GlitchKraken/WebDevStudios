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
