// A lot of this code is from ColoredPoints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform int u_whichTexture;
void main() {
  // Normal Color
    if(u_whichTexture == -2){
        gl_FragColor = u_FragColor;
    }
  // Cool looking color
    else if( u_whichTexture == -1){
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
  // Sky Texture
    else if( u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
  // Mossy Wall Texture
    else if(u_whichTexture == -3){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
  // Grass Texture
    else if(u_whichTexture == -4){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
  // If anything else show red for an error
    else{ 
        gl_FragColor = vec4(1, 0, 0, 1.0);
    }
}`;
  


// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_Size;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true} );
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

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

  // // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Set an initial value for the matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

} // setupGLSL

// Globals set by HTML UI

g_globalAngle = 0;

g_bodyAngle = 0; 
g_headAngle = 0;

g_RightArmAngle = 0;
g_rForeArmAngle = 0;
g_rHandAngle = 0;

g_LeftArmAngle = 0;
g_lForeArmAngle = 0;
g_lHandAngle = 0;

g_ulLegAngle = 0;
g_urLegAngle = 0;
g_llLegAngle = 0;
g_lrLegAngle = 0;

g_lFoot = 0;
g_rFoot = 0;

g_b1RotateAngle = 0;

g_rightArmAnimation = false;
g_jump = false;

function actionsForHtmlUI(){

  // special events
  canvas.onclick = function(ev){ if(ev.shiftKey == true){ g_rightArmAnimation = true; shiftClickStartTime = performance.now() / 1000.0;}};

  // Button Events

  document.getElementById('jumpAnimationOn').onclick = function() { g_jump = true;};
  document.getElementById('jumpAnimationOff').onclick = function() { g_jump = false;};

  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderEverything();});
  document.getElementById('bodySlide').addEventListener('mousemove', function () { g_bodyAngle = this.value; renderEverything();});
  document.getElementById('headSlide').addEventListener('mousemove', function () { g_headAngle = this.value; renderEverything();});

  document.getElementById('RarmSlide').addEventListener('mousemove', function () { g_RightArmAngle = this.value; renderEverything();});
  document.getElementById('LarmSlide').addEventListener('mousemove', function () { g_LeftArmAngle = this.value; renderEverything();});

  document.getElementById('rForearmSlide').addEventListener('mousemove', function () { g_rForeArmAngle = this.value; renderEverything();});
  document.getElementById('lForearmSlide').addEventListener('mousemove', function () { g_lForeArmAngle = this.value; renderEverything();});

  document.getElementById('rHandSlide').addEventListener('mousemove', function () { g_rHandAngle = this.value; renderEverything();});
  document.getElementById('lHandSlide').addEventListener('mousemove', function () { g_lHandAngle = this.value; renderEverything();});

  document.getElementById('urLegSlide').addEventListener('mousemove', function () { g_urLegAngle = this.value; renderEverything();});
  document.getElementById('ulLegSlide').addEventListener('mousemove', function () { g_ulLegAngle = this.value; renderEverything();});
  document.getElementById('lrLegSlide').addEventListener('mousemove', function () { g_lrLegAngle = this.value; renderEverything();});
  document.getElementById('llLegSlide').addEventListener('mousemove', function () { g_llLegAngle = this.value; renderEverything();});
  document.getElementById('lFootSlide').addEventListener('mousemove', function () { g_lFoot = this.value; renderEverything();});
  document.getElementById('rFootSlide').addEventListener('mousemove', function () { g_rFoot = this.value; renderEverything();});

} // actionsForHtmlUI

function main() {
  
  // set up the necessary webGL stuff
  setupWebGL();

  // set up the necessary shader GLSL stuff 
  setupGLSL();

  // do actions based on buttons from HTML
  actionsForHtmlUI();

  document.onkeydown = keydown;
  

  initTextures(gl, 0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // start the animation
  requestAnimationFrame(tick);
 

} // main

var g_startTime = performance.now()/ 1000.0;
var g_seconds = performance.now()/ 1000.0 - g_startTime;

var duration = performance.now() - g_startTime * 1000.0;

// Initialize variables
let fps = 0;
let lastFrameTime = 0;

function displayFPS(){

  // Display FPS value on HTML element or WebGL canvas
  document.getElementById('fpsDisplay').innerText = `FPS: ${Math.round(fps)}`;
}

function tick(){
  // performance
  const currentTime = performance.now();
  const elapsedTime = currentTime - lastFrameTime;
  // Calculate FPS
  fps = 1000 / elapsedTime;
  // Update last frame time
  lastFrameTime = currentTime;

  // Render WebGL scene

  // Display FPS
  displayFPS();
  // draw everything
  g_seconds = performance.now()/ 1000.0- g_startTime;

  // update the angle based on whether or not were using animation
  updateAnimationAngles();

  renderEverything();
  // request that tick is called again
  requestAnimationFrame(tick);
 
} // tick

var shiftClickStartTime = 0;
var shiftClickDuration = 6; // Duration of the animation in seconds

function updateAnimationAngles(){

  const currentTime = performance.now() / 1000.0; // Convert to seconds

  //g_b1RotateAngle = currentTime * 90;

  // if we get a shift-click
  if(g_rightArmAnimation){

    // animate for 6 seconds
    if (currentTime - shiftClickStartTime <= shiftClickDuration) {

      const minAngle = -60; 
      const maxAngle = 0; 
      let rawAngle = 60 * Math.sin(g_seconds);
      g_rForeArmAngle = Math.min(Math.max(rawAngle, minAngle), maxAngle);

      const min1 = -20;
      const max1 = 0;
      const raw1 = 45 * Math.sin(g_seconds);
      g_RightArmAngle = Math.min(Math.max(raw1, min1), max1);

      const min2 = -20;
      const max2 = 0;
      const raw2 = 500 * Math.sin(g_seconds);
      g_rHandAngle = Math.min(Math.max(raw2, min2), max2);
    } else {
      // Disable the animation after duration
      g_rightArmAnimation = false; 
    }

  }
  if(g_jump){
    // Define minimum and maximum angles for the legs
    const lminAngle = -20; // Example minimum angle
    const lmaxAngle = 40;  // Example maximum angle

    const uminAngle = -20; // Example minimum angle
    const umaxAngle = 20;  // Example maximum angle

    // Calculate the raw angle using trigonometric functions
    let LrawAngle = -25 * Math.sin(g_seconds); // Example for the llLegAngle
    let UrawAngle = 35 * Math.sin(g_seconds); // Example for the llLegAngle

    // Clamp the angle between the minimum and maximum values
    g_llLegAngle = Math.min(Math.max(LrawAngle, lminAngle), lmaxAngle);
    g_lrLegAngle = Math.min(Math.max(LrawAngle, lminAngle), lmaxAngle);

    g_ulLegAngle = Math.min(Math.max(UrawAngle, uminAngle), umaxAngle);
    g_urLegAngle = Math.min(Math.max(UrawAngle, uminAngle), umaxAngle);

    g_RightArmAngle = 45 * Math.sin(g_seconds);
    g_LeftArmAngle = 45 * Math.sin(g_seconds);

  }

  
}

function convertCoordsToGL(ev){

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);

} // convertCoordsToGL

function drawSurroundings(){
  // Draw the floor
  var floor = new Cube();
  floor.color = [0.20, 0.55, 0.20, 1];
  floor.matrix.translate(0, -1, 0);
  floor.matrix.scale(75, 0, 75);
  floor.matrix.translate(-0.5, 5, -0.5);
  floor.textureNum = -4;
  floor.render();

  // Draw the sky
  var sky = new Cube();
  sky.textureNum = -1;
  sky.color = [0, 0, 1, 1];
  sky.matrix.translate(0, -1, 0);
  sky.matrix.scale(75, 75, 75);
  sky.matrix.translate(-0.5, -0.3, -0.5);
  sky.textureNum = 0;
  sky.render();
}

function drawMonkey(){
   // Draw the body cube
   var body = new Cube();
   body.color = [0.620, 0.170, 0.170, 1.0];
   body.matrix.translate(0, -.25, 0);
   body.matrix.rotate(-5, 1, 0, 0);
   body.matrix.rotate(-g_bodyAngle, 0, 0, 1);
   var bodyMat = new Matrix4(body.matrix);
   var bodyMat2 = new Matrix4(body.matrix);
   var bodyMat3 = new Matrix4(body.matrix);
   var bodyMat4 = new Matrix4(body.matrix);
   var bodyMat5 = new Matrix4(body.matrix);
   body.matrix.scale(0.25, .7, .25);
   body.matrix.translate(-.5, 0, 0);
   body.render();
 
   
 
   // Draw the head
   var head = new Cube();
   head.color = [0.640, 0.170, 0.170, 1.0];
   head.matrix = bodyMat;
   head.matrix.translate(0, 0.65, 0);
   head.matrix.rotate(-g_headAngle, 0, 0, 1);
   head.matrix.scale(0.3, 0.3, 0.3);
   head.matrix.translate(-.5, 0, -0.0001);
   var headMat1 = new Matrix4(head.matrix);
   var headMat2 = new Matrix4(head.matrix);
   var headMat3 = new Matrix4(head.matrix);
   head.render();
 
   // face
   var face = new Cube();
   face.color = [0.960, 0.871, 0.702, 1.0];
   face.matrix = headMat3;
   face.matrix.scale(0.8, 0.5, 0.1);
   face.matrix.translate(0.13, 0.5, -1);
   var faceMat = new Matrix4(face.matrix);
   face.render();
 
   // mouth area
   var moutharea = new Cube();
   moutharea.color = [0.960, 0.871, 0.702, 1.0];
   moutharea.matrix = faceMat;
   moutharea.matrix.scale(0.7, 1, 1);
   moutharea.matrix.translate(0.19,-0.3, 0);
   var mouthAMAT = new Matrix4(moutharea.matrix)
   moutharea.render();
 
   // left eye
   var lEye = new Cube();
   lEye.color = [0, 0, 0, 1.0];
   lEye.matrix = mouthAMAT;
   lEye.matrix.scale(0.25, 0.4, 1);
   lEye.matrix.translate(0.5, 1, -0.1);
   var lEyeMat = new Matrix4(lEye.matrix); 
   lEye.render();
 
   // right eye
   var rEye = new Cube();
   rEye.color = [0, 0, 0, 1.0];
   rEye.matrix = lEyeMat;
   rEye.matrix.translate(2, 0, 0);
   rEye.render();
 
   // Draw left ear
   var leftEar = new Cube();
   leftEar.color = [0.960, 0.871, 0.702, 1.0];
   leftEar.matrix = headMat1
   leftEar.matrix.translate(1, 0, 0);
   leftEar.matrix.scale(0.25, 0.25, 0.1);
   leftEar.matrix.translate(0, 1.5, 2);
   leftEar.render();
 
   // Draw right ear
   var leftEar = new Cube();
   leftEar.color = [0.960, 0.871, 0.702, 1.0];
   leftEar.matrix = headMat2
   leftEar.matrix.translate(-0.25, 0, 0);
   leftEar.matrix.scale(0.25, 0.25, 0.1);
   leftEar.matrix.translate(0, 1.5, 2);
   leftEar.render();
 
   // Draw the right arm
   var rightArm = new Cube();
   rightArm.color = [0.620, 0.170, 0.170, 1.0];
   rightArm.matrix = bodyMat2;
   rightArm.matrix.translate(-0.3, 0.3, 0);
   rightArm.matrix.scale(0.15, 0.3, 0.15)
   rightArm.matrix.rotate(180, 0, 0, 1);
   rightArm.matrix.translate(-1.2, -1, -0.0001);
   rightArm.matrix.rotate(-10, 0, 0, 1);
   rightArm.matrix.rotate(g_RightArmAngle, 0, 0, 1);
   var rightArmMat = new Matrix4(rightArm.matrix);
   rightArm.render();
 
   var rForeArm = new Cube();
   rForeArm.color = [0.620, 0.170, 0.170, 1.0];
   rForeArm.matrix = rightArmMat;
   rForeArm.matrix.translate(0.15, 1, 0);
   rForeArm.matrix.scale(0.8, 0.6, 0.8);
   rForeArm.matrix.rotate(g_rForeArmAngle, 0, 0, 1);
   var rForeArmMat = new Matrix4(rForeArm.matrix);
   rForeArm.render();
 
   var rHand = new Cube();
   rHand.color = [0.960, 0.871, 0.702, 1.0];
   rHand.matrix = rForeArmMat;
   rHand.matrix.scale(1, 0.5, 1);
   rHand.matrix.translate(0, 2, -0.001);
   rHand.matrix.rotate(g_rHandAngle, 0, 0, 1);
   rHand.render();
  
   // // Draw the left arm
   var leftArm = new Cube();
   leftArm.color = [0.620, 0.170, 0.170, 1.0];
   leftArm.matrix = bodyMat3;
   leftArm.matrix.scale(0.15, 0.3, 0.15);
   leftArm.matrix.scale(-1, 1, 1);
   leftArm.matrix.rotate(180, 0, 0, 1);
   leftArm.matrix.translate(0.8, -2, -0.0001);
   leftArm.matrix.rotate(-10, 0, 0, 1);
   leftArm.matrix.rotate(g_LeftArmAngle, 0, 0, 1);
   var leftArmMat = new Matrix4(leftArm.matrix);
   leftArm.render();
 
   var lForeArm = new Cube();
   lForeArm.color = [0.620, 0.170, 0.170, 1.0];
   lForeArm.matrix = leftArmMat;
   lForeArm.matrix.translate(0.15, 1, 0);
   lForeArm.matrix.scale(0.8, 0.6, 0.8);
   lForeArm.matrix.rotate(g_lForeArmAngle, 0, 0, 1);
   var lForeArmMat = new Matrix4(lForeArm.matrix);
   lForeArm.render();
 
   var lHand = new Cube();
   lHand.color = [0.960, 0.871, 0.702, 1.0];
   lHand.matrix = lForeArmMat;
   lHand.matrix.scale(1, 0.5, 1);
   lHand.matrix.translate(0, 2, -0.001);
   lHand.matrix.rotate(g_lHandAngle, 0, 0, 1);
   lHand.render();
 
   // Draw the right upper leg
   var rightLeg = new Cube();
   rightLeg.color = [0.640, 0.170, 0.170, 1.0];
   rightLeg.matrix = bodyMat4;
   rightLeg.matrix.translate(-0.3, 0.3, 0);
   rightLeg.matrix.scale(0.15, 0.3, 0.15)
   rightLeg.matrix.rotate(180, 0, 0, 1);
   rightLeg.matrix.translate(-1.5, 1, -0.0001);
   rightLeg.matrix.rotate(-10, 0, 0, 1);
   rightLeg.matrix.rotate(g_urLegAngle, 0, 0, 1);
   var rightLegMat = new Matrix4(rightLeg.matrix);
  
   rightLeg.render();
   
   //Draw the right lower leg
   var rightLowerLeg = new Cube();
   rightLowerLeg.color = [0.647, 0.165, 0.165, 1.0];
   rightLowerLeg.matrix = rightLegMat;
   rightLowerLeg.matrix.translate(0, 0.7, -0.0002);
   rightLowerLeg.matrix.scale(0.8, 1, 0.8);
   rightLowerLeg.matrix.rotate(10, 0, 0, 1);
   rightLowerLeg.matrix.rotate(g_lrLegAngle, 0, 0, 1);
   var rll = new Matrix4(rightLowerLeg.matrix);
   rightLowerLeg.render();
 
   // Draw the right foot 
   var rightFoot = new Cube();
   rightFoot.color = [0.960, 0.871, 0.702, 1.0];
   rightFoot.matrix = rll;
   rightFoot.matrix.translate(0, 1, -0.0003);
   rightFoot.matrix.scale(1, 0.25, 1);
   rightFoot.matrix.rotate(g_rFoot, 0, 0, 1);
   rightFoot.render();
 
   // Draw the left upper leg
   var leftLeg = new Cube();
   leftLeg.color = [0.640, 0.170, 0.170, 1.0];
   leftLeg.matrix = bodyMat5;
   leftLeg.matrix.scale(0.15, 0.3, 0.15);
   leftLeg.matrix.scale(-1, 1, 1);
   leftLeg.matrix.rotate(180, 0, 0, 1);
   leftLeg.matrix.translate(0.5, 0, -0.0001);
   leftLeg.matrix.rotate(-10, 0, 0, 1);
   leftLeg.matrix.rotate(g_ulLegAngle, 0, 0, 1);
   var leftLegMat = new Matrix4(leftLeg.matrix);
   
   leftLeg.render();
 
   //Draw the left lower leg
   var leftLowerLeg = new Cube();
   leftLowerLeg.color = [0.647, 0.165, 0.165, 1.0];
   leftLowerLeg.matrix = leftLegMat;
   leftLowerLeg.matrix.translate(0, 0.7, -0.0002);
   leftLowerLeg.matrix.scale(0.8, 1, 0.8);
   leftLowerLeg.matrix.rotate(10, 0, 0, 1);
   leftLowerLeg.matrix.rotate(g_llLegAngle, 0, 0, 1);
   var lll = new Matrix4(leftLowerLeg.matrix);
   leftLowerLeg.render();
 
   // Draw the left foot 
   var leftFoot = new Cube();
   leftFoot.color = [0.960, 0.871, 0.702, 1.0];
   leftFoot.matrix = lll;
   leftFoot.matrix.translate(0, 1, -0.0003);
   leftFoot.matrix.scale(1, 0.25, 1);
   leftFoot.matrix.rotate(g_lFoot, 0, 0, 1);
   leftFoot.render();
 
}

function keydown(ev){
  // left
  if (ev.keyCode == 65){
    g_Camera.moveLeft(0.5);
  }
  // right
  if(ev.keyCode == 68){
    g_Camera.moveRight(0.5);
  }
  // forward
  if(ev.keyCode == 87){
    g_Camera.moveForward(0.5);
  }
  // backward
  if(ev.keyCode == 83){
    g_Camera.moveBackward(0.5);
  }
  if(ev.keyCode == 81){
    g_Camera.panLeft(10);
  }
  if(ev.keyCode == 69){
    g_Camera.panRight(10);
  }

  renderEverything();
}

var g_Camera = new Camera(canvas);

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap(){
  for(x = 0; x < 32; x += 1){
    for(y = 0; y < 32; y += 1){
      if(g_map[x][y]==1){
        var box = new Cube();
        box.textureNum = -3;
        box.color = [1,1,1,1];
        box.matrix.translate(x-4, -.75, y-4);
        box.matrix.scale(1, 2, 1);
        box.renderFaster();
      }
    } // for
  } // for
} // drawMap

function renderEverything(){

  // pass the projection matrix
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_Camera.projMat.elements);

  // pass the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_Camera.viewMat.elements);

  // pass the global rotation matrix
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw the sky and ground
  drawSurroundings();

  // draw the monkey
  drawMonkey();

  drawMap();
 
} // renderEverything

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
      // Vertex coordinates, texture coordinate
      -0.5,  0.5,   0.0, 1.0,
      -0.5, -0.5,   0.0, 0.0,
       0.5,  0.5,   1.0, 1.0,
       0.5, -0.5,   1.0, 0.0,
    ]);
    var n = 4; // The number of vertices
  
    // Create the buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
  
    // Get the storage location of a_TexCoord
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
    // Assign the buffer object to a_TexCoord variable
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
  
    return n;
}

function initTextures() {
  
    // sky image for skybox
    var image0 = new Image();  // Create the image object
    if (!image0) {
      console.log('Failed to create the image0 object');
      return false;
    }
    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendImageToTEXTURE0(image0); };

    // Tell the browser to load an image
    image0.src = '../resources/sky.jpg';

    // mossy wall image for maze walls
    var image1 = new Image();  // Create the image object
    if (!image1) {
      console.log('Failed to create the image1 object');
      return false;
    }
    // Register the event handler to be called on loading an image
    image1.onload = function(){ sendImageToTEXTURE1(image1); };

    // Tell the browser to load an image
    image1.src = '../resources/mossywall.jpg';

    // grass image for maze walls
    var image2 = new Image();  // Create the image object
    if (!image2) {
      console.log('Failed to create the image2 object');
      return false;
    }
    // Register the event handler to be called on loading an image
    image2.onload = function(){ sendImageToTEXTURE2(image2); };

    // Tell the browser to load an image
    image2.src = '../resources/grass.jpg';
  
    return true;
}

function sendImageToTEXTURE0(image) {

    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
  
}

function sendImageToTEXTURE1(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

}

function sendImageToTEXTURE2(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);

}

