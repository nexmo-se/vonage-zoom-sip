const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let env = process.env.NODE_ENV || 'development';
const path = require('path');
const envPath = path.join(__dirname);
console.log('envPath', envPath);
require('dotenv').config({ path: `${envPath}/.env.${env}` });

const cors = require('cors');

const opentok = require('./opentok/index');

const port = 3000;
const public = path.join(__dirname, 'public');
const sessions = {};

app.use(cors());
app.use('/', express.static(public));

const publisherPath = path.join(__dirname, '/public/index.html');
console.log(publisherPath);
app.use('/publisher', express.static(publisherPath));

app.get('/session/:room', async (req, res) => {
  try {
    const { room: roomName } = req.params;
    console.log(sessions);
    if (sessions[roomName]) {
      const data = opentok.generateToken(sessions[roomName]);
      res.json({
        sessionId: sessions[roomName],
        token: data.token,
        apiKey: data.apiKey,
      });
    } else {
      const data = await opentok.getCredentials();
      sessions[roomName] = data.sessionId;
      res.json({
        sessionId: data.sessionId,
        token: data.token,
        apiKey: data.apiKey,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post('/sip_dial', async (req, res) => {
  const { sessionId, meetingId, meetingPassword } = req.body;
  try {
    const response = await pentok.dialZoom(
      sessionId,
      meetingId,
      meetingPassword
    );
    console.log(response);
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
