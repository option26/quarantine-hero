import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

const envVariables = functions.config();

const sgMailApiKey = envVariables && envVariables.sendgrid && envVariables.sendgrid.key
  ? envVariables.sendgrid.key
  : null;
sgMail.setApiKey(sgMailApiKey);

const REGION_EUROPE_WEST_1 = 'europe-west1';
const MAX_RESULTS = 100;
const MAPS_ENABLED = true;
// How long we wait before we send email notifications after a person posted a help request.
const MINIMUM_NOTIFICATION_DELAY_MINUTES = 20;
const SEND_EMAILS = sgMailApiKey !== null;
const sendingMailsDisabledLogMessage = 'Sending emails is currently disabled.';
const EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK = 35_000;
// We only follow up with a user as long as his request is open
const MINIMUM_FOLLOWUP_DELAY_DAYS = 3;
// do not attempt to engage with open entries that are older that this value
const MAXIMUM_AGE_FOR_RE_ENGAGEMENT_DAYS = 10;
const MAXIMUM_ALLOWED_REQUESTS_FOR_HELP = 3;

export {
  REGION_EUROPE_WEST_1,
  MAX_RESULTS,
  MAPS_ENABLED,
  MINIMUM_NOTIFICATION_DELAY_MINUTES,
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_AGE_FOR_RE_ENGAGEMENT_DAYS,
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
};
