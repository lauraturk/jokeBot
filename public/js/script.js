const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();

recognition.lang = 'en-US';
recognition.interimResults = false;

document.querySelector('button').addEventListener('click', () => {
 recognition.start();
});

recognition.addEventListener('result', (e) => {
 let last = e.results.length -1;
 let text = e.results[last][0].transcript;

 socket.emit('chat message', text);
});

function synthVoice(text, status) {
 const synth = window.speechSynthesis;
 const utterance = new SpeechSynthesisUtterance();
 utterance.text = text;
 synth.speak(utterance);
 utterance.onend = function(event){
  if (status) {
   recognition.start();
  }
 } 
}

socket.on('bot reply', function(replyText, status) {
 synthVoice(replyText, status);
});

