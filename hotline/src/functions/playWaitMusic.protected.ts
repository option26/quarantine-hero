import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { Environment } from '../types/Environment';

// This whole function gets called repeatedly (i.e. as soon as it stops) until the caller is dequeued.
function playWaitMusic(context: Context<Environment>, event: { QueueTime: number }, callback: ServerlessCallback) {
  const response = new Twilio.twiml.VoiceResponse();

  // On every execution, we get the current wait time and if it exceeds a threshold, we dequeue caller.
  const waitTime = event.QueueTime;
  if (waitTime >= 30) {
    // TODO: Possibly redirect to other unavailability handler
    response.redirect(`https://${context.DOMAIN_NAME}/noAgentAvailable`);
    return callback(null, response);
  }

  // IMPORTANT: Use a short audio here as the length of the audio is the lower limit for the waiting time of a user
  // TODO: Use real waiting music
  response.play({ loop: 1 }, `https://${context.DOMAIN_NAME}/Waiting.wav`);

  return callback(null, response);
};

export { playWaitMusic as handler };
