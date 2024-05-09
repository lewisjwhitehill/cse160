class Camera{
    constructor(){
            this.type = 'camera';
            this.eye = new Vector3([0, 0, -3]);
            this.at = new Vector3([0, 0, 100]);
            this.up = new Vector3([0, 1, 0]);
            this.fov = 60;

            this.viewMat = new Matrix4();
            this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], // eye
            this.at.elements[0],this.at.elements[1],this.at.elements[2],   // at
            this.up.elements[0],this.up.elements[1],this.up.elements[2]);  // up

                                          
            this.projMat = new Matrix4();
            this.projMat.setPerspective(90, 400/400, .1, 100);

    }

    setViewMat(){
        this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2], // eye
        this.at.elements[0],this.at.elements[1],this.at.elements[2],   // at
        this.up.elements[0],this.up.elements[1],this.up.elements[2]);  // up
    }

    moveForward(speed){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        // scale
        f.mul(speed);
        this.eye.add(f);
        this.at.add(f);
       
    }
      
    moveBackward(speed){
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        // scale
        b.mul(speed);
        this.eye.add(b);
        this.at.add(b);
        
    }

    moveLeft(speed){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();
        // scale
        s.mul(speed);
        this.eye.add(s);
        this.at.add(s);
        
    }

    moveRight(speed){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = new Vector3();
        s = Vector3.cross(f, this.up);
        s.normalize();
        // scale
        s.mul(speed);
        this.eye.add(s);
        this.at.add(s);
        
    }
      
    panLeft(alpha=10){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var fprime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(fprime);
       
    }

    panRight(alpha){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var fprime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(fprime);
      
    }

}
