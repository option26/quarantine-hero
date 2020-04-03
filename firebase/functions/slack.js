const axios = require('axios');
const functions = require('firebase-functions');

exports.postToSlack = function postToSlack(snapId, snapData) {
  const { request, plz, location } = snapData.d;

  axios({
    method: 'POST',
    url: functions.config().slack.url,
    headers: {
      'Content-type': 'application/json',
    },
    data: {
      text: `https://www.quarantaenehelden.org/#/offer-help/${snapId}\n${plz} - ${location}\n>${request.replace('\n', '\n>')}`,
    },
  });
};
