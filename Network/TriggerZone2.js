var Trigger = pc.createScript('triggerZone2');

// initialize code called once per entity
Trigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};


Trigger.prototype.onTriggerEnter = function(entity) {
    console.log("Trigger");
    this.app.fire("zone2");
};