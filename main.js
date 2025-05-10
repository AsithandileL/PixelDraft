
function doClear() {
    graphics.clearRect(0, 0, canvas.width, canvas.height);
    graphics.fillStyle = "white";
    graphics.fillRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("clearButton").onclick = doClear;

    "use strict";  // gives improved error-checking in scripts.

    var canvas;    // The canvas element on which we will draw.
    var graphics;  // A 2D graphics context for drawing on the canvas.
    
    /**
     * This function returns a string representing a random RGB color.
     * The returned string can be assigned as the value of graphics.fillStyle
     * or graphics.strokeStyle.
     */
    function randomColorString() {
        var r = Math.floor(256*Math.random());
        var g = Math.floor(256*Math.random());
        var b = Math.floor(256*Math.random());
        return "rgb(" + r + "," + g + "," + b + ")";
    }
        
    /**
     * This function is called in init() to set up mouse event handling
     * on the canvas.  You can modify the nested functions doMouseDown,
     * doMouseDrag, and possibly doMouseUp to change the reponse to
     * mouse events.  As an example, this program does some simple drawing.
     */
    function installMouseHandler() {

        var dragging = false;  // set to true when a drag action is in progress.
        var startX, startY;    // coordinates of mouse at start of drag.
        var prevX, prevY;      // previous mouse position during a drag.
        
        var colorChoice;  // Integer code for the selected color in the "colorChoice"
                          // popup menu.  The value is assigned in doMouseDown.
        
        var toolChoice;   // Integer code for the selected tool in the "toolChoice"
                          // popup menu.  The value is assigned in doMouseDown.
        
        function doMouseDown(evt) {

                // This function is called when the user presses a button on the mouse.
                // Only the main mouse button will start a drag.
            if (dragging) {
                return;  // if a drag is in progress, don't start another.
            }
            if (evt.button != 0) {
                return;  // don't respond unless the button is the main (left) mouse button.
            }
            var x,y;  // mouse position in canvas coordinates
            var r = canvas.getBoundingClientRect();
            x = Math.round(evt.clientX - r.left);  // translate mouse position from screen coords to canvas coords.
            y = Math.round(evt.clientY - r.top);   // round to integer values; some browsers would give non-integers.
            dragging = true;  // (this won't be the case for all mousedowns in all programs)
            if (dragging) {
                startX = prevX = x;
                startY = prevY = y;
                document.addEventListener("mousemove", doMouseMove, false);
                document.addEventListener("mouseup", doMouseUp, false);
            }
            colorChoice = Number(document.getElementById("colorChoice").value);
            toolChoice = Number(document.getElementById("toolChoice").value);
            // TODO: Anything else to do when mouse is first pressed?
        
        
        }
        
        function doMouseMove(evt) {
                // This function is called when the user moves the mouse during a drag.
            if (!dragging) {
                return;  // (shouldn't be possible)
            }
            var x,y;  // mouse position in canvas coordinates
            var r = canvas.getBoundingClientRect();
            x = Math.round(evt.clientX - r.left);  
            y = Math.round(evt.clientY - r.top);
            
            /*------------------------------------------------------------*/
            /* TODO: Add support for more drawing tools. */
            
            graphics.fillStyle = colorChoice === 0 ? randomColorString() :
                                 colorChoice === 1 ? "red" :
                                 colorChoice === 2 ? "green" :
                                 colorChoice === 3 ? "blue" :
                                 "purple";

            switch(toolChoice) {
                case 1: // Square Tool
                    if ( Math.abs(x-prevX) + Math.abs(y-prevY) >= 3 ) {
                        graphics.fillRect(x-20,y-20,40,40);
                        graphics.strokeRect(x-20,y-20,40,40);
                    }
                    break;
                case 2: // Heart Tool
                    drawHeart(x, y);
                    break;
                case 3: // Curve Tool
                    graphics.strokeLine(prevX, prevY, x, y);
                    break;
                case 4: // Circle Tool
                    graphics.fillCircle(x, y, 20);
                    break;
                case 5: // Erase Tool
                    graphics.clearRect(x-20, y-20, 40, 40);
                    break;
                default:
                    break;
            }
            
            prevX = x;  // update prevX,prevY to prepare for next call to doMouseMove
            prevY = y;
        }
        
        function doMouseUp(evt) {
                // This function is called when the user releases a mouse button during a drag.
            if (!dragging) {
                return;  // (shouldn't be possible)
            }
            dragging = false;
            document.removeEventListener("mousemove", doMouseMove, false);
            document.removeEventListener("mouseup", doMouseMove, false);
         }
         
         canvas.addEventListener("mousedown", doMouseDown, false);

   } // end installMouseHandler

   function drawHeart(x, y) {
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.bezierCurveTo(x - 20, y - 20, x - 40, y + 20, x, y + 40);
        graphics.bezierCurveTo(x + 40, y + 20, x + 20, y - 20, x, y);
        graphics.fill();
        graphics.stroke();
   }

   /**
     * This function can be called to add a collection of extra drawing function to
     * a graphics context, to make it easier to draw basic shapes with that context.
     * The parameter, graphics, must be a canvas 2d graphics context.
     *
     * The following new functions are added to the graphics context:
     *
     *    graphics.strokeLine(x1,y1,x2,y2) -- stroke the line from (x1,y1) to (x2,y2).
     *    graphics.fillCircle(x,y,r) -- fill the circle with center (x,y) and radius r.
     *    graphics.strokeCircle(x,y,r) -- stroke the circle.
     *    graphics.fillOval(x,y,r1,r2) -- fill oval with center (x,y) and radii r1 and r2.
     *    graphics.stokeOval(x,y,r1,r2) -- stroke the oval
     *    graphics.fillPoly(x1,y1,x2,y2,...) -- fill polygon with vertices (x1,y1), (x2,y2), ...
     *    graphics.strokePoly(x1,y1,x2,y2,...) -- stroke the polygon.
     *    graphics.getRGB(x,y) -- returns the color components of pixel at (x,y) as an array of
     *         four integers in the range 0 to 255, in the order red, green, blue, alpha.
     *
     * (Note that "this" in a function that is called as a member of an object refers to that
     * object.  Here, this will refer to the graphics context.)
     */
    function addGraphicsContextExtras(graphics) {
        graphics.strokeLine = function(x1,y1,x2,y2) {
           this.beginPath();
           this.moveTo(x1,y1);
           this.lineTo(x2,y2);
           this.stroke();
        }
        graphics.fillCircle = function(x,y,r) {
           this.beginPath();
           this.arc(x,y,r,0,2*Math.PI,false);
           this.fill();
        }
        graphics.strokeCircle = function(x,y,radius) {
           this.beginPath();
           this.arc(x,y,radius,0,2*Math.PI,false);
           this.stroke();
        }
        graphics.fillPoly = function() { 
            if (arguments.length < 6)
               return;
            this.beginPath();
            this.moveTo(arguments[0],arguments[1]);
            for (var i = 2; i < arguments.length; i+=2)
               this.lineTo(arguments[i],arguments[i+1]);
            this.closePath();
            this.fill();
        }
        graphics.strokePoly = function() { 
            if (arguments.length < 6)
               return;
            this.beginPath();
            this.moveTo(arguments[0],arguments[1]);
            for (var i = 2; i < arguments.length; i+=2)
               this.lineTo(arguments[i],arguments[i+1]);
            this.closePath();
            this.stroke();
        }
        graphics.getRGB = function(x,y) {
            var c = this.getImageData(x,y,1,1).data;
            return [c[0],c[1],c[2],c[3]];
        }
    }  // end addGraphicsContextExtras
    
    /**
     * This function is called when the page is loaded.  It sets up the canvas and 
     * adds mouse event handling.  It is the main routine for this page.
     */
     function init() {
    try {
        canvas = document.getElementById("canvas");
        graphics = canvas.getContext("2d");
    } catch (e) {
        document.getElementById("canvasholder").innerHTML =
            "<p>Canvas graphics is not supported.<br>" +
            "An error occurred while initializing graphics.</p>";
        return;
    }
    addGraphicsContextExtras(graphics);
    installMouseHandler();
    graphics.fillStyle = "white";
    graphics.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("clearButton").onclick = doClear;
}
