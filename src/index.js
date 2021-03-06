import { createServer } from 'http';
import express from 'express';
import { twiml } from 'twilio';
import { urlencoded } from 'body-parser';
import { convertSentence } from './converter';
import "core-js/stable";
import "regenerator-runtime/runtime";
import { readFileSync } from "fs";

// the messaging response, from twiml/twilio
const MessagingResponse = twiml.MessagingResponse;

// initialize the express server
const app = express();

// use body-parser to parse the contents of the received message.
app.use(urlencoded({ extended: true })); 

// store the dictionary
const dictionary = JSON.parse(readFileSync("src/mojis.json", "utf-8"));

// setup a response for sms messages.
app.post('/sms', async (req, res) => {
    
  // store the received message.
  const receivedMsg = req.body.Body;

  // convert the received text into emoji, word by word.
  let convertedReceived = await convertSentence(receivedMsg, dictionary);

  // log the converted and the received.
  console.log(`${receivedMsg} -> ${convertedReceived}`);

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