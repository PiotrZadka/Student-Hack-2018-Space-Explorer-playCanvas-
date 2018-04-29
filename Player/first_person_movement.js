var FirstPersonMovement = pc.createScript('firstPersonMovement');
    // movement
    
/// optional, assign a camera entity, otherwise one is created
FirstPersonMovement.attributes.add('camera', {
    type: 'entity'
});
    
FirstPersonMovement.attributes.add('power', {
    type: 'number'
});

FirstPersonMovement.attributes.add('lookSpeed', {
    type: 'number'
});

// initialize code called once per entity
FirstPersonMovement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this.camera = null;
    this.eulers = new pc.Vec3();

    
    player = this.app.root.findByName("Player");
    var app = this.app;
    // Listen for mouse move events
    app.mouse.on("mousemove", this._onMouseMove, this);

    // when the mouse is clicked hide the cursor
    app.mouse.on("mousedown", function () {
        app.mouse.enablePointerLock();
    }, this);            

    // Check for required components
    if (!this.entity.collision) {
        console.error("First Person Movement script needs to have a 'collision' component");
    }

    if (!this.entity.rigidbody || this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC) {
        console.error("First Person Movement script needs to have a DYNAMIC 'rigidbody' component");
    }
    
    
    
};

// update code called every frame
FirstPersonMovement.prototype.update = function(dt) {
    // If a camera isn't assigned from the Editor, create one
    if (!this.camera) {
        this._createCamera();
    }
   

    
    var force = this.force;
    var app = this.app;

    // Get camera directions to determine movement directions
    var forward = this.camera.forward;
    var right = this.camera.right;
    var up = this.camera.up;
    var down = this.camera.down;   
    var x = 0;
    var z = 0;
    var y = 0;


    // Use W-A-S-D keys to move player
    // Check for key presses
    
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q)) {
        x -= right.x;
        z -= right.z;
    }
    
    
    if (app.keyboard.wasPressed(pc.KEY_T)) {
       console.log("talk");
         this.app.fire("speechStart");
    }
    

    if (app.keyboard.isPressed(pc.KEY_D)) {
        x += right.x;
        z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
        x += forward.x;
        z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
        x -= forward.x;
        z -= forward.z;
    }
    
    if (app.keyboard.isPressed(pc.KEY_SPACE)){
    
        y += up.y;
    }
    
    if (app.keyboard.wasReleased(pc.KEY_SPACE)){

        y -=  up.y;
    }
    


    // use direction from keypresses to apply a force to the character
    if (x !== 0 && z !== 0 || y !== 0) {
       
        force.set(x, y, z).normalize().scale(this.power);
        this.entity.rigidbody.applyForce(force);
    }

    // update camera angle from mouse events
    this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, this.eulers.z);
    //player.setLocalEulerAngles(0, this.eulers.y, 0);


};

FirstPersonMovement.prototype._onMouseMove = function (e) {
    // If pointer is disabled
    // If the left mouse button is down update the camera from mouse movement
    if (pc.Mouse.isPointerLocked() || e.buttons[0]) {
        
        
        this.eulers.x -= this.lookSpeed * e.dx;
        this.eulers.y -= (this.lookSpeed * e.dy);
        this.eulers.y = pc.math.clamp(this.eulers.y, -60, 90);
        
        
        player.setLocalEulerAngles(0, this.eulers.y, 0);
 
    }            
};

FirstPersonMovement.prototype._createCamera = function () {
    // If user hasn't assigned a camera, create a new one
    this.camera = new pc.Entity();
    this.camera.setName("First Person Camera");
    this.camera.addComponent("camera");
    this.entity.addChild(this.camera);
    this.camera.translateLocal(0, 0.5, 0);
};

