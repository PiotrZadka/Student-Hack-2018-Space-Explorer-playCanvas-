var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

//Twilio config
require('dotenv').config();
const accountSid = 'ACbc0a51bdf26be1c4845f88d68a0fd0b4';
const authToken = '285a993cabae06fabf525b64818d4ef6';
const client = require('twilio')(accountSid, authToken);

//Public folder attach (index.html)
app.use(express.static("public"));

//Player connects to the server (From Play Canvas)
io.on("connection", function(socket) {

  //Information to server (Player connected)
  console.log("Player "+socket.id+" has connected!");
  //New Player information
  socket.on("newPlayer",function(data){
    // Emit socket ID back to player
    socket.emit("playerID",socket.id);
  });
  //Player spawned
  socket.on("spawnPosition",function(data){
    //Inform all players about the spawn position
    io.sockets.emit("spawnPosition",data);
  });

  //Player moved
  socket.on("positionUpdate",function(data){
    //Inform all players about the movement
    socket.broadcast.emit("positionUpdate",data);
  });

  //Player step on zone 1
  socket.on("zone1",function(data){
    var phoneNumberArray = ["+447506031291"];
    phoneNumberArray.forEach(function(pn) {
    client.messages
      .create({
        body: "Our Astronaut just discovered a new Spaceship, Vanguard!",
        to: '+447506031291',
        from: '+441637820064',
      })
      //.then(message => process.stdout.write(message.sid));
      console.log("Zone 1, Message Sent!");
    });
  });

  //Player step on zone 2
  socket.on("zone2",function(data){
    var phoneNumberArray = ["+447506031291"];
    phoneNumberArray.forEach(function(pn) {
    client.messages
      .create({
        body: "Out Astronaut just discovered a new Spaceship, Falcon 5!",
        to: '+447506031291',
        from: '+441637820064',
      })
      //.then(message => process.stdout.write(message.sid));
      console.log("Zone 2, Message Sent!")
    });
  });

  // A.I. Commands
  socket.on("speech",function(data){
    /*
    1. Hello, anyone here?
    2. Blue?
    3. How are you?
    4. What happen here?
    5. Can you scan the area?
    6. Can you tell me a thing about Vanguard?
    7. Can you tell me a thing about falcon?
    8. Can you check my vitals signs?
    9. What happen to Vanguard crew?
    10. What happen to falcon crew?
    11. Thank you!
    */
    console.log(data);
    var sentence = "";
    if(data.includes("how") && data.includes("are") && data.includes("you")){
      sentence = "Not too bad actually, but i'm just a Artificial Inteligence";
    }
    if(data.includes("what") && data.includes("happen")){
      sentence = "It looks like a crash site. Unfortunetly that's all I know";
    }
    if(data.includes("hello")){
      sentence = "Hello Traveler, I'm Blue";
    }
    if(data.includes("blue")){
      sentence = "That's my name, what is your request?";
    }
    if(data.includes("Vanguard")){
      sentence = "Vanguard, crashed on moon not so long ago, apparently it had an electric car as a payload";
    }
    if(data.includes("Falcon")){
      sentence = "Falcon 5, who even name space ships like this? I was surprised same as you.";
    }
    if(data.includes("vitals")){
      sentence = "All vital seems to be in normal state";
    }
    if(data.includes("thank")){
      sentence = "You are welcome traveler";
    }
    if(data.includes("scan")){
      sentence = "According to my scanners, there is no life form detected in the 20 kilometers radius";
    }
    console.log(sentence);
    socket.emit("speech",sentence);
  });

  //Player disconnects
	socket.on("disconnect", function() {
    //Information to server (Player disconnected)
    console.log("Player "+socket.id+" disconnected");
  });

});

//Listening to port
server.listen(8081, function() {
	console.log("Server Works! - connect to NGROK address");
});
