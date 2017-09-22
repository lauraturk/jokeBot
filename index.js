const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express');
const app = express();
const server = app.listen(5000); 
const apiai = require('apiai')(APIAI_TOKEN);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
 res.sendFile('index.html');
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
 console.log('hey! sockets are connected')
});

const checkEnd = (contextArray) => {
 const contextNames = contextArray.map(context => {
  return context.name;
 });
 return contextNames.indexOf('joke-end') === -1 ? false : true;
}

io.on('connection', function(socket) {
 socket.on('chat message', (text) => {
  let apiaiReq = apiai.textRequest(text, {
   sessionId: APIAI_SESSION_ID 
  }); 
  
  apiaiReq.on('response', (response) => {
   let aiText = response.result.fulfillment.speech;

   if (checkEnd(response.result.contexts)){
    socket.emit('bot reply', aiText, false) 
   } else {
    socket.emit('bot reply', aiText, true); 
   }

  });

  apiaiReq.on('error', (error) => {
   console.log(error); 
  });

  apiaiReq.end();

 });
});

