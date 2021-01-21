import axios from 'axios';
import * as twilio from 'twilio';

import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { Environment } from '../types/Environment';

// Main entry point for incoming hotline calls
async function handleIncomingCall(context: Context<Environment>, event: {}, callback: ServerlessCallback) {
  const twilioClient = context.getTwilioClient();

  let hotlineAgents: Array<string> = [];
  try {
    // Get numbers of all agents in shift
    const agents: { getAgentsInShift: (context: Context<Environment>) => string[] } = require(Runtime.getAssets()['/agents.js'].path);
    const response = await agents.getAgentsInShift(context);
    console.log(response);

    if (response === undefined || !Array.isArray(response)) {
      throw new Error('Bad response');
    }

    hotlineAgents = response;
  } catch (err) {
    await axios.post(context.SLACK_WEBHOOK_URL, { text: `An error occured: ${err}` }).catch(() => { });
  }

  if (hotlineAgents.length === 0) {
    const response = new Twilio.twiml.VoiceResponse();
    response.redirect(`https://${context.DOMAIN_NAME}/noAgentAvailable`);
    return callback(null, response);
  }

  const response = await smartSimulring(twilioClient, hotlineAgents, context);
  //const response = standardSimulring(hotlineAgents);
  return callback(null, response);
};

async function smartSimulring(twilioClient: twilio.Twilio, hotlineAgents: Array<string>, context: Context<Environment>) {
  const response = new Twilio.twiml.VoiceResponse();
  // Enque the caller. The caller will be dequeued by the first agent that answers.
  response.enqueue({
    waitUrl: `https://${context.DOMAIN_NAME}/playWaitMusic`
  }, 'hotline');

  // Calls each hotline agent and screens them
  for (const hotlineAgent of hotlineAgents) {
    try {
      // TODO: Store call sid's and stop all calls if first answered??
      await twilioClient.calls.create({
        url: `https://${context.DOMAIN_NAME}/screenAgent`,
        to: hotlineAgent,
        from: '+4989143770224'
      });
    } catch (err) {
      console.log(err);
    }
  }

  return response;
}

export { handleIncomingCall as handler };

// function standardSimulring(hotlineAgents) {
//   const response = new Twilio.twiml.VoiceResponse();
//   const dial = response.dial();
//   for (const hotlineAgent of hotlineAgents) {
//     dial.number(hotlineAgent);
//   }
//   return response;
// }
