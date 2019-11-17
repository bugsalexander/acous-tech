import { createServer } from 'http';
import express from 'express';
import { twiml } from 'twilio';
import { urlencoded } from 'body-parser';
import { convert } from './converter';
import "core-js/stable";
import "regenerator-runtime/runtime";

// the messaging response, from twiml/twilio
const MessagingResponse = twiml.MessagingResponse;

// initialize the express server
const app = express();

// use body-parser to parse the contents of the received message.
app.use(urlencoded({ extended: true })); 

// setup a response for sms messages.
app.post('/sms', async (req, res) => {
    
  // store and log the received text
  const receivedMsg = req.body.Body;
  console.log(`Received: ${receivedMsg}`);

  // convert the received text into emoji. 
  const convertedReceived = await convert(receivedMsg);

  // create the response
  const response = new MessagingResponse();

  // set the response's message to the converted emoji
  response.message(convertedReceived);

  // send.
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(response.toString());
});

// launch the server!
createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});