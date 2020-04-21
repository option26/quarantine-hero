const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1UsyHXG2_XQob7wGCrsSeSGyWt7sgmo-2Ez0ed3JQbdM';
const RANGE = 'Verfuegbarkeiten!data';

// eslint-disable-next-line camelcase
const { client_id, client_secret } = functions.config().googlesheets;

const REDIRECT_URL = 'https://europe-west1-qhero-stage.cloudfunctions.net/oauthCallback';
const DB_TOKEN_PATH = '/google-sheets-api-tokens';

const oauthClient = new OAuth2Client(client_id, client_secret, REDIRECT_URL);

const weekdayIndex = {
  'Monday Morning': 0,
  'Monday Afternoon': 1,
  'Tuesday Morning': 2,
  'Tuesday Afternoon': 3,
  'Wednesday Morning': 4,
  'Wednesday Afternoon': 5,
  'Thursday Morning': 6,
  'Thursday Afternoon': 7,
  'Friday Morning': 8,
  'Friday Afternoon': 9,
  'Saturday Morning': 10,
  'Saturday Afternoon': 11,
  'Sunday Morning': 12,
  'Sunday Afternoon': 13,
};

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getCurrentShift() {
  const now = new Date();
  const day = days[now.getDay()];

  // as long as this function is run in
  // 'europe-west1' this will work properly
  // because the time zone is identical to
  // what we assume our call center hours
  // in germany are
  const hour = now.getHours();

  let partOfDay;
  switch (true) {
    case hour >= 0 && hour < 10:
      partOfDay = 'Night';
      break;
    case hour >= 10 && hour < 14:
      partOfDay = 'Morning';
      break;
    case hour >= 14 && hour < 18:
      partOfDay = 'Afternoon';
      break;
    case hour >= 18:
      partOfDay = 'Night';
      break;
    default:
      throw new Error(`Invalid hour ${hour}`);
  }

  return `${day} ${partOfDay}`;
}

async function getAuthorizedClient() {
  const snapshot = await admin.database().ref(DB_TOKEN_PATH).once('value');
  const oauthTokens = snapshot.val();
  oauthClient.setCredentials(oauthTokens);

  return oauthClient;
}

async function getValues(params) {

  const sheets = google.sheets({ version: 'v4', auth: await getAuthorizedClient() });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function configureGoogleApiAccess(req, res) {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  res.redirect(oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  }));
}

async function oauthCallback(req, res) {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  const { code } = req.query;
  try {
    const { tokens } = await oauthClient.getToken(code);
    await admin.database().ref(DB_TOKEN_PATH).set(tokens);
    return res.send('Successfully connected google sheets with firebase functions').status(200);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.status(400).send(err);
  }
}

async function getPeopleForShift(shift) {
  const params = {
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  };

  const res = await getValues(params);
  const rows = res.data.values;

  if (!rows.length) {
    throw new Error('No data found');
  }

  return rows
    .map((row) => {
      const number = row[1];
      const availability = row.slice(2, row.length);

      const rowIdx = weekdayIndex[shift];

      return availability[rowIdx] === 'ja' ? number : null;
    })
    .filter(Boolean);
}

async function handleIncomingCall(req, res) {
  // TODO: Secure with some kind of token as this exposes our phone numbers!
  const shift = getCurrentShift();

  try {
    const people = await getPeopleForShift(shift);
    if (people.length === 0) {
      // Make it easier for Twilio Flow to check for empty string
      res.status(200).send('');
    } else {
      res.status(200).send(people.join(','));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`An error occurred while retrieving numbers: ${err}`);
    res.send('').status(500).end();
  }
}

module.exports = {
  handleIncomingCall,
  configureGoogleApiAccess,
  oauthCallback,
};
