import { createServer } from 'http';
import express from 'express';
import { twiml } from 'twilio';
import { urlencoded } from 'body-parser';
import { convert } from './converter';

// the messaging response, from twiml/twilio
const MessagingResponse = twiml.MessagingResponse;

// initialize the express server
const app = express();

// use body-parser to parse the contents of the received message.
app.use(urlencoded({ extended: true })); 

// setup a response for sms messages.
app.post('/sms', (req, res) => {
    
  // store and log the received text
  const receivedMsg = req.body.Body;
  console.log(`Received: ${receivedMsg}`);

  // convert the received text into emoji.
  const convertedReceived = convert(receivedMsg);

  // create the response
  const response = new MessagingResponse();

  // set the response's message to the converted emoji
  twiml.message(convertedReceived);

  // send.
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// launch the server!
createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});