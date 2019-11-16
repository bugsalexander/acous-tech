const fs = require('fs');

/**
 * The main function.
 */
function main() {
  const credentialsFilePath = "../credentials.json";

  // read in the file as a JSONObject, with props accountSid and authToken.
  const credentialsFile = fs.readFileSync(credentialsFilePath, "utf-8");
  const credentialsObj = JSON.parse(credentialsFile);
  
  const accountSid = credentialsObj.accountSid;
  const authToken = credentialsObj.authToken;
  const number = credentialsObj.number;

  // launch the server.
  launch(accountSid, authToken, number);
}

/**
 * Launches the main server app.
 * @param {string} accountSid the account sid to use for twilio verification
 * @param {string} authToken the authentication token to use for twilio verification
 * @param {string} number the phone number to send and receive from
 */
async function launch(accountSid, authToken, number) {

  // require twilio.
  const client = require('twilio')(accountSid, authToken);

  // our number! is a string.
  const us = number;
}

