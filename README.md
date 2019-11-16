# acous-tech
A visual representation of your acoustic environment.

# how to run the twilio app:

First run `yarn install` to install the needed dependencies for the project.

Next, run (in a separate terminal tab) `node src/server.js`. This will launch 
the express server, which automatically listens on port 1337.

Finally, run `npx twilio phone-numbers:update <twilio number here> --sms-url="http://localhost:1337/sms"` 
to run the twilio ngrok server, which will create a custom domain that will listen to the provided
phone number, and will direct traffic to `localhost:1337`, where the express server will be able to 
respond.

Now, the server will be able to receive and respond to texts.