// A lot of this code is from ColoredPoints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_ShapeSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_ShapeSize;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' + 
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global variables
var g_ShapesList = [];

let canvas;
let gl;
let a_Position;
let u_ShapeSize;
let u_FragColor;
let g_SelectedColor = [1.0, 0.0, 0.0, 1.0];
let g_Size = 5;
let g_selectedType = POINT;
let g_numSegments = 6;

function setupWebGL(){
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true} );
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

} // setupWebGL

function setupGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_ShapeSize
  u_ShapeSize = gl.getUniformLocation(gl.program, 'u_ShapeSize');
  if (!u_ShapeSize) {
    console.log('Failed to get the storage location of u_ShapeSize');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

} // setupGLSL

function actionsForHtmlUI(){

  // Button Events

  // clear canvas if pressed
  document.getElementById('clearcanvas').onclick = function() { g_ShapesList = []; renderEverything(); };

  // Different Shapes
  document.getElementById('square').onclick = function() { g_selectedType = POINT; };
  document.getElementById('triangle').onclick = function() {g_selectedType = TRIANGLE; };
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE; };

  // Slider Events

  // Chat GPT told me to use the input function instead of mouseup because I was having a bug where the color
  // wouldn't change when I moved the slider sometimes.

  // set amount of red
  document.getElementById('redSlide').addEventListener('input', function () { g_SelectedColor[0] = this.value/100; });
  // set amount of green
  document.getElementById('greenSlide').addEventListener('input', function () { g_SelectedColor[1] = this.value/100; });
  // set amount of blue
  document.getElementById('blueSlide').addEventListener('input', function () { g_SelectedColor[2] = this.value/100; });
  // set size
  document.getElementById('sizeSlide').addEventListener('input', function () { g_Size = this.value; });
  // set number of segments for cicle
  document.getElementById('numSegments').addEventListener('input', function () {g_numSegments = this.value; });

} // actionsForHtmlUI

function main() {
  
  // set up the necessary webGL stuff
  setupWebGL();

  // set up the necessary shader GLSL stuff 
  setupGLSL();

  // do actions based on buttons from HTML
  actionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) }}

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

} // main

function convertCoordsToGL(ev){

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);

} // convertCoordsToGL

function renderEverything(){
    // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // how many shapes we have
  var len = g_ShapesList.length;

  // loop through all of our shapes and draw them
  for(var i = 0; i < len; i++) {
    g_ShapesList[i].render();
  }

} // renderEverything

function click(ev) {
  
  // call a function to convert the canvas client coordinates to WebGL
  [x, y] = convertCoordsToGL(ev);

  // Create a new shape object

  let shape;

  // Which button was last clicked?
  if(g_selectedType == POINT){
    shape = new Point();
  }else if(g_selectedType ==  TRIANGLE){
    shape = new Triangle();
  }else{
    shape = new Circle();
    shape.segments = g_numSegments;
  }

  shape.position = [x, y];
  shape.color = g_SelectedColor.slice();
  shape.size = g_Size

  // push our new point to our list of points
  g_ShapesList.push(shape);

  // clear the canvas, redraw all the previous things and now the current one
  renderEverything();
  
}
