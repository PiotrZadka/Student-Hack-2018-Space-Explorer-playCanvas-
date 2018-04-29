var Network = pc.createScript('network');
var ID;

var serverPlayers = [];

var tempPos = {
    x : 0,
    y : 0,
    z : 0
};

var tempRot;


var clientPlayer;
var serverPlayer;
var clientPos;
var clientRotation;
var init;
// initialize code called once per entity
Network.prototype.initialize = function() {
   console.log("start");

    clientPlayer = this.app.root.findByName("Player");
    serverPlayer = this.app.root.findByName("newPlayer");
    clientPos = clientPlayer.getPosition();
    clientRotation = clientPlayer.getLocalEulerAngles();
    this.socket = io.connect('https://65240294.ngrok.io');
    
    this.socket.emit('newPlayer');
    
    this.socket.on('playerID', (data) =>{
        
        ID = data;
        init = true;
        console.log(data);
        
        this.socket.emit ('spawnPosition',{id: ID, x: clientPos.x, y: clientPos.y, z: clientPos.z, posData: clientRotation});
        
    });
    
     
    
    
    
    this.socket.on('spawnPosition', (data) =>{
        
        if(ID != data.id){
            serverPlayer.setPosition(data.posData);
        }
        /*var newPlayer = serverPlayer.clone();
        newPlayer.enabled = true;
        newPlayer.setPosition(data.x, data.y, data.z);
        
        serverPlayers.push({
            id:data.id,
            object:newPlayer
        });*/
    });
    
    this.socket.on('positionUpdate', (data) =>{
        
        if(ID != data.id){
            //console.log(data.r);
            serverPlayer.setLocalPosition(data.x,data.y,data.z);
            //console.log(data.r);
            //var y = data.r.data["1"];
            console.log("packet", data);
           
            
            console.log(data.posData);
            serverPlayer.setLocalEulerAngles(data.posData);


        }
        
    });
    
    
    this.app.on("zone1", (data) => {
        console.log("Enter zone1");
        this.socket.emit('zone1');
    });
    
    this.app.on("zone2", (data) => {
        console.log("Enter zone2");
        this.socket.emit('zone2');
    });
    
   
          
};



Network.prototype.update = function (dt) {
    this.updatePosition ();
};


Network.prototype.updatePosition = function () {
     

    

    var pos = clientPlayer.getPosition();
    var myRotation = clientPlayer.getLocalRotation();
    var mytransF = clientPlayer.getLocalTransform();
    mytransF.setLocalRotation(clientPlayer.getLocalRotation());
    
    
    
    if(pos.x != tempPos.x && pos.y != tempPos.y && pos.z != tempPos.z && myRotation != tempRot){

        tempPos.x = pos.x;
        tempPos.y = pos.y;
        tempPos.z = pos.z;
        tempRot = myRotation;

        //console.log(rotation.x);
        //console.log(rotation.y);
        // console.log("x:",rotation.x);
        // console.log("y:",rotation.y);
        // console.log("z:",rotation.z);

        //console.log("z",clientPlayer.getEulerAngles().z);

        this.socket.emit ('positionUpdate', {id: this.ID, x: pos.x, y: pos.y, z: pos.z, posData: mytransF});
    }
        

    
};


// swap method called for script hot-reloading
// inherit your script state here
// Network.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/