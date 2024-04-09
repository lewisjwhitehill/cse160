// asg0.js

var canvas;
var ctx;

function main(){
    // Retrieve the canvas element
    canvas = document.getElementById('asg0');
    if(!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return False
    }

    // Get the rendering context for 2DCG
    ctx = canvas.getContext('2d');

    // Draw the black background
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Setting the black color
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // Fill a rectangle with the color
    
} // main

// handling a drawing event
function handleDrawEvent(){
    // clear the canvas
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // Fill a rectangle with the color
    // get the input and put it in console
    let x1 = document.getElementById('x1').value;
    let y1 = document.getElementById('y1').value;
    let new_vec1 = new Vector3([x1, y1, 0]);

    let x2 = document.getElementById('x2').value;
    let y2 = document.getElementById('y2').value;
    let new_vec2 = new Vector3([x2, y2, 0]);

    drawVector(new_vec1, "red");
    drawVector(new_vec2, "blue");

} // handleDrawEvent

function handleDrawOperationEvent(){
    // clear the canvas
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); // Fill a rectangle with the color
    // get the input and put it in console
    let x1 = document.getElementById('x1').value;
    let y1 = document.getElementById('y1').value;
    let new_vec1 = new Vector3([x1, y1, 0]);

    let x2 = document.getElementById('x2').value;
    let y2 = document.getElementById('y2').value;
    let new_vec2 = new Vector3([x2, y2, 0]);

    drawVector(new_vec1, "red");
    drawVector(new_vec2, "blue");

    let operation = document.getElementById('operation-select').value;
    let scalar = document.getElementById('scalar').value;

    if(operation == "add"){
        new_vec1.add(new_vec2);
        drawVector(new_vec1, "green");
    }else if(operation == "sub"){
        new_vec1.sub(new_vec2);
        drawVector(new_vec1, "green");
    }else if(operation == "mul"){
        new_vec1.mul(scalar);
        drawVector(new_vec1, "green");
        new_vec2.mul(scalar);
        drawVector(new_vec2, "green");
    }else if(operation == "div"){
        new_vec1.div(scalar);
        drawVector(new_vec1, "green");
        new_vec2.div(scalar);
        drawVector(new_vec2, "green");
    }else if(operation == "mag"){
        let mag1 = new_vec1.magnitude();
        let mag2 = new_vec2.magnitude();
        console.log("Magnitude v1: ", mag1);
        console.log("Magnitude v2: ", mag2);
    }else if(operation == "norm"){
        drawVector(new_vec1.normalize(), "green");
        drawVector(new_vec2.normalize(), "green");
    }else if(operation == "between"){
        let res = Vector3.dot(new_vec1, new_vec2);
        res /= (new_vec1.magnitude() * new_vec2.magnitude());
        console.log("Angle Between: ", Math.acos(res) * (180 / Math.PI));
    }else if(operation == "area"){
        let new_v = Vector3.cross(new_vec1, new_vec2);
        console.log("Area of the triangle: ", new_v.magnitude() / 2);
    }
    

} // handleDrawOperationEvent

// function to draw a singular vector
function drawVector(v, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    // varaibles for the origin
    ox = canvas.clientWidth / 2;
    oy = canvas.clientHeight / 2;
    // variables for the x and y of the vector
    x = v.elements[0]
    y = v.elements[1]
    // move to the origin and then draw the vector
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + (x * 20), oy - (y * 20));
    ctx.stroke();
}


