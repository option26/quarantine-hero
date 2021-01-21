import axios from 'axios';

import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { Environment } from '../types/Environment';

// This whole function gets called repeatedly (i.e. as soon as it stops) until the caller is dequeued.
async function noAgentAvailable(context: Context<Environment>, event: { From: string }, callback: ServerlessCallback) {
  await axios.post(context.SLACK_WEBHOOK_URL, { text: `Phone call from ${event.From} was not picked up` }).catch(() => {});

  const response = new Twilio.twiml.VoiceResponse();
  response.play({ loop: 1 }, `https://${context.DOMAIN_NAME}/NoAgentAvailable.wav`);

  return callback(null, response);
};

export { noAgentAvailable as handler };
