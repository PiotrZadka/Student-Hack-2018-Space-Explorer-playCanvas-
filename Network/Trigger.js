var Trigger = pc.createScript('trigger');

// initialize code called once per entity
Trigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
};

Trigger.prototype.onTriggerEnter = function(entity) {
    this.app.fire("zone1");
};

Trigger.prototype.onTriggerLeave = function(entity) {
    console.log("leave");
};

// swap method called for script hot-reloading
// inherit your script state here
// Trigger.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/