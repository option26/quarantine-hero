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
// How long we wait before we send email notifications after a person posted a help request
const MINIMUM_NOTIFICATION_DELAY_MINUTES = 20;
const SEND_EMAILS = sgMailApiKey !== null;
const sendingMailsDisabledLogMessage = 'Sending emails is currently disabled.';
const EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK = 35_000;
// The minimum threshold until we contact a user about their open entry for the first time
const MINIMUM_FOLLOWUP_DELAY_DAYS = 1;
// The maximum threshold until we do not contact a user about their open entry anymore
const MAXIMUM_FOLLOWUP_DELAY_DAYS = 5;
// The cooldown before a user can request more help again
const MORE_HELP_REQUEST_COOLDOWN_DAYS = 1;
// The cooldown before we attempt to contact a user again
const ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS = 12;
const MAXIMUM_ALLOWED_REQUESTS_FOR_HELP = 3;

export {
  REGION_EUROPE_WEST_1,
  MAX_RESULTS,
  MAPS_ENABLED,
  MINIMUM_NOTIFICATION_DELAY_MINUTES,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
  EMAIL_NOTIFICATION_AUDIENCE_SIZE_SANITY_CHECK,
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_FOLLOWUP_DELAY_DAYS,
  MORE_HELP_REQUEST_COOLDOWN_DAYS,
  ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS,
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
};
