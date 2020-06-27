import { google } from 'googleapis';
import * as functions from 'firebase-functions';
import * as moment from 'moment-timezone';

import { Parameters } from '@interface/hotline/Parameters';

const {
  sheet_id: SPREADSHEET_ID,
  service_account_email: SERVICE_ACCOUNT_EMAIL,
  private_key: PRIVATE_KEY,
  range: RANGE,
  api_key: API_KEY,
} = functions.config().googlesheets;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const weekdayIndex: { [key: string]: number } = {
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

function getCurrentShift(): string {
  const day = days[moment().tz('Europe/Berlin').get('day')];
  const hour = moment().tz('Europe/Berlin').get('hour');

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

async function getValues(params: Parameters): Promise<{ data: { values: string[][] } }> {
  const auth = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL, undefined, PRIVATE_KEY, SCOPES);
  const sheets = google.sheets({ version: 'v4', auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(params, (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

async function getPeopleForShift(shift: string): Promise<(null | string)[]> {
  const params: Parameters = {
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  };

  const res = await getValues(params);
  const rows: string[][] = res.data.values;

  if (!rows || !rows.length) {
    throw new Error('No data found');
  }

  return rows
    .map((row: string[]) => {
      const number: string = row[1];
      const availability: string[] = row.slice(2, row.length);

      const colIdx: number = weekdayIndex[shift];

      return availability[colIdx] === 'ja' ? number : null;
    })
    .filter(entry => entry !== null);
}

async function handleIncomingCall(req: any, res: any): Promise<void> {
  const { apikey } = req.query;

  if (!apikey || apikey !== API_KEY) {
    res.status(401).end();
    return;
  }

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
    res.status(500).end();
  }
}

export { handleIncomingCall };
