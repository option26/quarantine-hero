import { google } from 'googleapis';
const moment = require('moment-timezone');

import '@twilio-labs/serverless-runtime-types';
import { Context } from '@twilio-labs/serverless-runtime-types/types';
import { Environment } from '../types/Environment';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const weekdayIndex: { [key: string]: number } = {
  'Monday Morning': 0,
  'Monday Afternoon': 1,
  'Monday Night': 2,
  'Tuesday Morning': 3,
  'Tuesday Afternoon': 4,
  'Tuesday Night': 5,
  'Wednesday Morning': 6,
  'Wednesday Afternoon': 7,
  'Wednesday Night': 8,
  'Thursday Morning': 9,
  'Thursday Afternoon': 10,
  'Thursday Night': 11,
  'Friday Morning': 12,
  'Friday Afternoon': 13,
  'Friday Night': 14,
  'Saturday Morning': 15,
  'Saturday Afternoon': 16,
  'Saturday Night': 17,
  'Sunday Morning': 18,
  'Sunday Afternoon': 19,
  'Sunday Night': 20,
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

// Returns numbers of all agents in shift
export async function getAgentsInShift(context: Context<Environment>) {
  const shift = getCurrentShift();

  try {
    const phoneNumbers = await getAgentNumbers(shift, context);
    return phoneNumbers;
  } catch (err) {
    console.error('An error occurred while retrieving numbers', err);
    return [];
  }
  
};

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

async function getSpreadsheetData(context: Context<Environment>): Promise<string[][] | undefined> {
  const { SPREADSHEET_ID, RANGE, SERVICE_ACCOUNT_EMAIL, PRIVATE_KEY_1, PRIVATE_KEY_2, PRIVATE_KEY_3, PRIVATE_KEY_4, PRIVATE_KEY_5 } = context;
  const PRIVATE_KEY = PRIVATE_KEY_1 + PRIVATE_KEY_2 + PRIVATE_KEY_3 + PRIVATE_KEY_4 + PRIVATE_KEY_5;

  const spreadsheetParams = {
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  };

  const auth = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL, undefined, PRIVATE_KEY, SCOPES);
  const sheetsApi = google.sheets({ version: 'v4', auth });

  const response = await new Promise<{ data: { values?: string[][] } }>((resolve, reject) => {
    sheetsApi.spreadsheets.values.get(spreadsheetParams, (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  return response.data.values;
}

async function getAgentNumbers(shift: string, context: Context<Environment>): Promise<string[]> {
  const rows = await getSpreadsheetData(context);

  if (!rows || !rows.length) {
    throw new Error('No data found');
  }

  return rows
    .map((row: string[]) => {
      const phoneNumber: string = row[1];
      const availability: string[] = row.slice(2, row.length);

      const colIdx: number = weekdayIndex[shift];

      return availability[colIdx] === 'ja' ? phoneNumber : null;
    })
    .filter((entry): entry is string => entry !== null);
}
