const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const converter = require('./converter');

// initialize the express server
const app = express();

// use body-parser to parse the contents of the received message.
app.use(bodyParser.urlencoded({ extended: true })); 

// setup a response for sms messages.
app.post('/sms', (req, res) => {
    
  const receivedMsg = req.body.Body;
  console.log(`Received: ${receivedMsg}`);

  const twiml = new MessagingResponse();

  // do some stuff here! like setting this var to the response.
  const response = converter.convert(receivedMsg);

  twiml.message(response);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});