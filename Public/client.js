var socket = io.connect("http://localhost:8081");

//speach recognition

const SpeechRecognition = webkitSpeechRecognition;
const SpeechGrammarList = webkitSpeechGrammarList;
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = (e) => {
  const result = e.results[e.results.length - 1][0].transcript;
  console.log('result: ', result);
  socket.emit("speech",result);
}

recognition.onerror = (e) => {
  console.error(e);
}

recognition.onend = () => {
  console.log('recognition end.');
}

function start() {
  recognition.start();
}
