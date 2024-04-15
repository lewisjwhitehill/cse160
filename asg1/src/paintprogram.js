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

function drawVolcano(){

  // volcano base
  let t1 = new Triangle();
  t1.size = 50;
  t1.color = [0.25, 0.1, 0.1, 1.0];
  t1.position = [-0.5, -0.5, 0.0];
  t1.render();

  let t2 = new Triangle();
  t2.size = 50;
  t2.color = [0.25, 0.1, 0.1, 1.0];
  t2.position = [-0.4, -0.5, 0.0];
  t2.render();

  let t3 = new Triangle();
  t3.size = 50;
  t3.color = [0.25, 0.1, 0.1, 1.0];
  t3.position = [-0.3, -0.5, 0.0];
  t3.render();

  let t4 = new Triangle();
  t4.size = 50;
  t4.color = [0.25, 0.1, 0.1, 1.0];
  t4.position = [-0.2, -0.5, 0.0];
  t4.render();

  let t5 = new Triangle();
  t5.size = 50;
  t5.color = [0.25, 0.1, 0.1, 1.0];
  t5.position = [-0.1, -0.5, 0.0];
  t5.render();

  let t55 = new Triangle();
  t55.size = 50;
  t55.color = [0.25, 0.1, 0.1, 1.0];
  t55.position = [-0.0, -0.5, 0.0];
  t55.render();

  // 2nd layer

  let t6 = new Triangle();
  t6.size = 50;
  t6.color = [0.25, 0.1, 0.1, 1.0];
  t6.position = [-0.4, -0.4, 0.0];
  t6.render();

  let t7 = new Triangle();
  t7.size = 50;
  t7.color = [0.25, 0.1, 0.1, 1.0];
  t7.position = [-0.3, -0.4, 0.0];
  t7.render();

  let t8 = new Triangle();
  t8.size = 50;
  t8.color = [0.25, 0.1, 0.1, 1.0];
  t8.position = [-0.2, -0.4, 0.0];
  t8.render();

  let t9 = new Triangle();
  t9.size = 50;
  t9.color = [0.25, 0.1, 0.1, 1.0];
  t9.position = [-0.1, -0.4, 0.0];
  t9.render();

  // 3rd layer

  let t10 = new Triangle();
  t10.size = 50;
  t10.color = [0.25, 0.1, 0.1, 1.0];
  t10.position = [-0.3, -0.3, 0.0];
  t10.render();

  let t11 = new Triangle();
  t11.size = 50;
  t11.color = [0.25, 0.1, 0.1, 1.0];
  t11.position = [-0.25, -0.3, 0.0];
  t11.render();

  let t12 = new Triangle();
  t12.size = 50;
  t12.color = [0.25, 0.1, 0.1, 1.0];
  t12.position = [-0.2, -0.3, 0.0];
  t12.render();

  // lava errupting
  let l1 = new Triangle();
  l1.size = 20;
  l1.color = [0.8, 0.0, 0.0, 1.0];
  l1.position = [-0.25, -0.1, 0.0];
  l1.render();

  let l2 = new Triangle();
  l2.size = 20;
  l2.color = [0.8, 0.8, 0.0, 1.0];
  l2.position = [-0.25, 0.0, 0.0];
  l2.render();

  let l3 = new Triangle();
  l3.size = 20;
  l3.color = [0.8, 0.0, 0.0, 1.0];
  l3.position = [-0.25, 0.1, 0.0];
  l3.render();

  // 2
  let l4 = new Triangle();
  l4.size = 20;
  l4.color = [0.8, 0.8, 0.0, 1.0];
  l4.position = [-0.35, -0.1, 0.0];
  l4.render();

  let l5 = new Triangle();
  l5.size = 20;
  l5.color = [0.8, 0.0, 0.0, 1.0];
  l5.position = [-0.4, 0.0, 0.0];
  l5.render();

  let l6 = new Triangle();
  l6.size = 20;
  l6.color = [0.8, 0.8, 0.0, 1.0];
  l6.position = [-0.45, 0.1, 0.0];
  l6.render();

  let l66 = new Triangle();
  l66.size = 20;
  l66.color = [0.8, 0.0, 0.0, 1.0];
  l66.position = [-0.5, 0.2, 0.0];
  l66.render();

  // 3
  let l7 = new Triangle();
  l7.size = 20;
  l7.color = [0.8, 0.8, 0.0, 1.0];
  l7.position = [-0.15, -0.1, 0.0];
  l7.render();

  let l8 = new Triangle();
  l8.size = 20;
  l8.color = [0.8, 0.0, 0.0, 1.0];
  l8.position = [-0.1, 0.0, 0.0];
  l8.render();

  let l9 = new Triangle();
  l9.size = 20;
  l9.color = [0.8, 0.8, 0.0, 1.0];
  l9.position = [-0.05, 0.1, 0.0];
  l9.render();

  let l99 = new Triangle();
  l99.size = 20;
  l99.color = [0.8, 0.0, 0.0, 1.0];
  l99.position = [0.0, 0.2, 0.0];
  l99.render();

}

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
  document.getElementById('volcano').onclick = function() { drawVolcano(); };

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
