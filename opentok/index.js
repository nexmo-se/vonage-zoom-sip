const OpenTok = require('opentok');
const apiKey = process.env.VIDEO_API_API_KEY;
const apiSecret = process.env.VIDEO_API_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error(
    'Missing config values for env params OT_API_KEY and OT_API_SECRET'
  );
}
let sessionId;

const opentok = new OpenTok(apiKey, apiSecret);

const createSessionandToken = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function (error, session) {
      if (error) {
        reject(error);
      } else {
        sessionId = session.sessionId;
        const token = opentok.generateToken(sessionId);
        resolve({ sessionId: sessionId, token: token });
        //console.log("Session ID: " + sessionId);
      }
    });
  });
};

const generateToken = (sessionId) => {
  const token = opentok.generateToken(sessionId);
  return { token: token, apiKey: apiKey };
};

const dialZoom = (sessionId, meetingId, password) => {
  console.log(meetingId, password);
  const token = opentok.generateToken(sessionId);
  const sipResult = opentok.dial(
    sessionId,
    token,
    `sip:${meetingId}.${password}@zoomcrc.com;transport=tls`,
    { secure: true, video: true },
    (err, resp) => {
      if (!err) console.log(resp);
      else console.log(err);
    }
  );
  console.log(sipResult);
};

const getCredentials = async (session = null) => {
  const data = await createSessionandToken(session);
  sessionId = data.sessionId;
  const token = data.token;
  return { sessionId: sessionId, token: token, apiKey: apiKey };
};

module.exports = {
  getCredentials,
  generateToken,
  dialZoom,
};
