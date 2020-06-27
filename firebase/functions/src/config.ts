import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

const envVariables = functions.config();

const sgMailApiKey = envVariables && envVariables.sendgrid && envVariables.sendgrid.key
  ? envVariables.sendgrid.key
  : null;
sgMail.setApiKey(sgMailApiKey);

const REGION_EUROPE_WEST_1 = 'europe-west1';
const MAX_RESULTS = 30;
const MAPS_ENABLED = true;
const MINIMUM_NOTIFICATION_DELAY_INITIAL_CONTACT_WITH_OPEN_ENTRIES_MINUTES = 20;
const SEND_EMAILS = sgMailApiKey !== null;
const sendingMailsDisabledLogMessage = 'Sending emails is currently disabled.';
const EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK = 35_000;
const MINIMUM_NOTIFICATION_DELAY_FURTHER_CONTACT_WITH_OPEN_ENTRIES_DAYS = 3;
const MAXIMUM_ALLOWED_AGE_FOR_FURTHER_CONTACT_DAYS = 10;

export {
  REGION_EUROPE_WEST_1,
  MAX_RESULTS,
  MAPS_ENABLED,
  MINIMUM_NOTIFICATION_DELAY_INITIAL_CONTACT_WITH_OPEN_ENTRIES_MINUTES,
  MINIMUM_NOTIFICATION_DELAY_FURTHER_CONTACT_WITH_OPEN_ENTRIES_DAYS,
  MAXIMUM_ALLOWED_AGE_FOR_FURTHER_CONTACT_DAYS,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
};
