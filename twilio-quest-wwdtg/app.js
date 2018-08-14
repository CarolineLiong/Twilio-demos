// Moderated Conference Phone call
// 'These aren't the droids you're looking for: Twilio Quest
const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const app = express();

app.use(urlencoded({ extended: false }));

//set up the conference
var fs = require('fs');
app.get('/', (req, res) => {
  fs.readFile('./index.html', (err, data)=> {
    if (err) {
      res.writeHead(404);
      res.write('File not found!');
    } else {
      res.write(data);
    }
  });
});
//make or join a conference when someone calls the twilio number (847) 440-3996
app.post('/call', (req, res, next) => {
  console.log('called app.post(/call)');
  const conf = 'myConference';
  const response = new VoiceResponse();
  const dial = response.dial();
  dial.conference(conf)
  res.type('text/xml');
  res.send(response.toString());
  return next();
});

app.post('/hitbutton', (req,res) => {
  console.log('I hit the button');
  res.send('Take out a person from the conference call and have them listen to music!');
  const conf = 'myConference';
  client.conferences.list({friendlyName: conf, status: 'in-progress' }, function(err, data) {
    const conferenceSid = data[0].sid;
    client.conferences(conferenceSid).participants.list(function(err,list) {
      client.calls(list[0].callSid).update({method: 'GET', url: 'https://www.twilio.com/quest/MS1O2SXK6NISPKY.mp3'})
      .then(call => console.log(call))
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
    });
  });
});

// Create an HTTP server and listen for requests on port 3000
console.log('Twilio Client app HTTP server running at http://127.0.0.1:3000');
app.listen(3000);
