window.addEventListener('load', function () {
  // Handling all of our errors here by alerting them
  function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

  let apiKey, sessionId, token;

  const callButton = document.getElementById('call__button');
  callButton.addEventListener('click', async (e) => {
    const meetingId = document.getElementById('meetingId').value;
    const meetingPassword = document.getElementById('meetingPassword').value;
    const data = { sessionId, meetingId, meetingPassword };
    e.preventDefault();
    const response = await fetch('/sip_dial', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
  });

  // (optional) add server code here

  const SERVER_BASE_URL = 'http://localhost:3000';
  fetch(SERVER_BASE_URL + '/session/test')
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      apiKey = res.apiKey;
      sessionId = res.sessionId;
      token = res.token;
      initializeSession();
    })
    .catch(handleError);

  function initializeSession() {
    const session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {
      session.subscribe(
        event.stream,
        'subscriber',
        {
          insertMode: 'append',
          width: '100%',
          height: '100%',
        },
        handleError
      );
    });

    // Create a publisher
    const publisher = OT.initPublisher(
      'publisher',
      {
        insertMode: 'append',
        width: '100%',
        height: '100%',
      },
      handleError
    );

    // Connect to the session
    session.connect(token, function (error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  }
});
