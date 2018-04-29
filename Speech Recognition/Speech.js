var Speech = pc.createScript('speech');

// initialize code called once per entity
Speech.prototype.initialize = function() {
    
var socket = io.connect("https://65240294.ngrok.io");

//speach recognition
const SpeechRecognition = webkitSpeechRecognition;
const SpeechGrammarList = webkitSpeechGrammarList;
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

 this.app.on("speechStart", (data) => {
        console.log("speech");
        recognition.start();
});


    
this.app.on("speechEnd", (data)=>{
    
});

socket.on('speech', (data) =>{
    var msg = new SpeechSynthesisUtterance(data);
    
    console.log(data);
    msg.voiceURI = 'female';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 2; //0 to 2 
    msg.lang = 'en-GB';
        
    window.speechSynthesis.speak(msg);         
 });
    
recognition.onresult = (e) => {
  const result = e.results[e.results.length - 1][0].transcript;
  console.log('result: ', result);
  socket.emit("speech",result);
};

recognition.onerror = (e) => {
  console.error(e);
};

recognition.onend = (e) => {
  console.log('recognition end.');
    
    
};

function start() {
  recognition.start();
}
    
};

// update code called every frame
Speech.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Speech.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/