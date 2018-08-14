const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

client.calls
  .create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+1xxxxxxxxxx',
    from: '+1xxxxxxxxxx',
  })
  .then(call => console.log(call.sid));
