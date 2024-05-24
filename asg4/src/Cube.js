class Cube{
    constructor(){
            this.type = 'cube';
            this.color = [1.0, 1.0, 1.0, 1.0];
            this.matrix = new Matrix4();
            this.textureNum = -2;
    }
    renderFaster(){

        var rgba = this.color;

        // Pass the texture number 
        gl.uniform1i(u_whichTexture, this.textureNum);
      
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to the u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];
        var allUVs = [];
        var allNormals = [];

        // Front
        allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
        allUVs = allUVs.concat([1,0, 0,1, 0,0]);
        allNormals =  allNormals.concat([0,0,-1, 0,0,-1, 0,0,-1]);

        allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);
        allUVs = allUVs.concat([1,0, 1,1, 0,1]);
        allNormals =  allNormals.concat([0,0,-1, 0,0,-1, 0,0,-1]);

        // Back
        allverts = allverts.concat( [0,0,1, 1,1,1, 1,0,1]);
        allUVs = allUVs.concat([1,0, 0,1, 0,0]);
        allNormals =  allNormals.concat([0,0,1, 0,0,1, 0,0,1]);

        allverts = allverts.concat([ 0,0,1, 1,1,1, 0,1,1]);
        allUVs = allUVs.concat( [1,0, 0,1, 1,1]);
        allNormals =  allNormals.concat([0,0,1, 0,0,1, 0,0,1]);

        // Top
        allverts = allverts.concat(  [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        allUVs = allUVs.concat( [1,1, 1,0, 0,0]);
        allNormals =  allNormals.concat([0,1,0, 0,1,0, 0,1,0]);

        allverts = allverts.concat([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);
        allUVs = allUVs.concat(  [1,1, 0,0, 0,1]);
        allNormals =  allNormals.concat([0,1,0, 0,1,0, 0,1,0]);

        // Bottom
        allverts = allverts.concat( [0.0,0,0.0, 0.0,0,1.0, 1.0,0,1.0]);
        allUVs = allUVs.concat([1,1, 1,0, 0,0]);
        allNormals =  allNormals.concat([0,-1,0, 0,-1,0, 0,-1,0]);

        allverts = allverts.concat( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0]);
        allUVs = allUVs.concat([1,1, 0,0, 0,1]);
        allNormals =  allNormals.concat([0,-1,0, 0,-1,0, 0,-1,0]);

        // Left
        allverts = allverts.concat( [0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0]);
        allUVs = allUVs.concat([1,0, 0,0, 0,1]);
        allNormals =  allNormals.concat([-1,0,0, -1,0,0, -1,0,0]);

        allverts = allverts.concat( [0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,0.0]);
        allUVs = allUVs.concat([0,1, 1,1, 1,0]);
        allNormals =  allNormals.concat([-1,0,0, -1,0,0, -1,0,0]);

        // Right
        allverts = allverts.concat( [1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
        allUVs = allUVs.concat([1,0, 0,0, 0,1]);
        allNormals =  allNormals.concat([1,0,0, 1,0,0, 1,0,0]);

        allverts = allverts.concat( [1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        allUVs = allUVs.concat([0,1, 1,1, 1,0]);
        allNormals =  allNormals.concat([1,0,0, 1,0,0, 1,0,0]);

        drawTriangle3DUVNormal(allverts, allUVs, allNormals);
  
    } // renderFaster

    render(){

            var rgba = this.color;

            // Pass the texture number 
            gl.uniform1i(u_whichTexture, this.textureNum);
          
            // Pass the color of a point to u_FragColor variable
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            // Pass the matrix to the u_ModelMatrix attribute
            gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

                // Draw the front of the cube 0,1
                drawTriangle3DUVNormal( [0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
                drawTriangle3DUVNormal( [0,0,0, 0,1,0, 1,1,0], [1,0, 1,1, 0,1], [0,0,-1, 0,0,-1, 0,0,-1]);
 
            
                // Draw the back of the cube
                drawTriangle3DUVNormal( [0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0], [0,0,1, 0,0,1, 0,0,1]);
                drawTriangle3DUVNormal( [ 0,0,1, 1,1,1, 0,1,1], [1,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

            // Fake Lighting
            gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

           
            // Fake lighting
            gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

            // Draw top of the cube
            drawTriangle3DUVNormal( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [1,1, 1,0, 0,0], [0,1,0, 0,1,0, 0,1,0]);
            drawTriangle3DUVNormal( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], [1,1, 0,0, 0,1], [0,1,0, 0,1,0, 0,1,0]);

            // Fake lighting
            gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

            // Draw bottom of the cube
            drawTriangle3DUVNormal( [0.0,0,0.0, 0.0,0,1.0, 1.0,0,1.0], [1,1, 1,0, 0,0], [0,-1,0, 0,-1,0, 0,-1,0]);
            drawTriangle3DUVNormal( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0], [1,1, 0,0, 0,1], [0,-1,0, 0,-1,0, 0,-1,0]);

            // Draw left side of cube
            drawTriangle3DUVNormal( [0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0] );
            drawTriangle3DUVNormal( [0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,0.0], [0,1, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);

            // Draw right side of cube
            drawTriangle3DUVNormal( [1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0], [1,0, 0,0, 0,1], [1,0,0, 1,0,0, 1,0,0]);
            drawTriangle3DUVNormal( [1.0,1.0,1.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,1, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);

            
    } // render

} // class Cube