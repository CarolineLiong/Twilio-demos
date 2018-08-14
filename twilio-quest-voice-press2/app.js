const express = require('express');
const app = express();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  function gather() {
    const gatherNode = twiml.gather ({
      input: 'speech dtmf',
      numDigits: 1,
      timeout: 5,
    });
    gatherNode.say('For sales, press 1 or say sales. For support, press 2 or say support. To listen to your options again, press 3 or say repeat.');
    twiml.redirect('/voice');
  }
  var num = req.body.Digits;
  var speech = req.body.SpeechResult;
  console.log(req.body.SpeechResult);
  if (num== '1' || speech=='sales' ) {
    twiml.say('I am connecting you to sales, please hold');
    twiml.redirect({method: 'GET'}, '/sales');
  }
  else if (num=='2' || speech=='support') {
    twiml.say('I am connecting you to support, please hold');
    twiml.redirect({method: 'GET'}, '/support');
  }
  else if (num =='3' || speech=='repeat') {
    twiml.say('Listen to your options again');
    twiml.redirect('/voice');
  }
  else {
    gather();
  }
  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/sales', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say("Connecting you now");
  const dial = twiml.dial();
  dial.number('xxx-xxx-xxxx');

  res.type('text/xml');
  res.send(twiml.toString());
});

console.log('Twilio Client app HTTP server running at http://127.0.0.1:3000');
app.listen(3000);
