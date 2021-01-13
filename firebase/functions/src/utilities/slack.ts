import axios from 'axios';
import * as functions from 'firebase-functions';
import * as crypto from 'crypto';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { onAllowHotlineAnswer } from '../domain/onOfferHelpCreate';

async function postToSlack(snapId: string, snapData: AskForHelpCollectionEntry): Promise<string> {
  const { request, location, isHotline } = snapData.d;

  const url = `https://www.quarantaenehelden.org/#/offer-help/${snapId}`;
  const header = `${location}${isHotline ? ' - (Hotline)' : ''}`;
  const requestText = `>${request.replace(/\n/g, '\n>')}`;
  const text = `${url}\n${header}\n${requestText}`;

  const response = await axios({
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${functions.config().slack.token}`,
    },
    data: {
      channel: functions.config().slack.channel,
      text,
      unfurl_links: false,
      unfurl_media: false
    },
  });

  return response.data.ts;
}

// offerHelp created --> send message to slack with response text and a button that says allow / deny
// button pressed --> call firebase webhook that triggers sending of that email (how do we identify which one? --> By the offer help)

async function postReplyToSlack(messageRef: string | undefined, message: string, mention = false): Promise<void> {
  if (!messageRef) {
    return;
  }

  const text = `${mention ? `<!subteam^${functions.config().slack.group}> ` : ''}${message}`;

  await axios({
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${functions.config().slack.token}`,
    },
    data: {
      channel: functions.config().slack.channel,
      thread_ts: messageRef,
      text,
    },
  });
}

async function answerDirectly(message: string, responseUrl: string) {
  await axios({
    method: 'POST',
    url: responseUrl,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${functions.config().slack.token}`,
    },
    data: {
      text: message
    },
  });
}

async function onSlackInteraction(request: functions.https.Request, response: functions.Response<any>) {
  // validate message is from slack
  const { signing_secret } = functions.config().slack;
  const hmac = crypto.createHmac('sha256', signing_secret);

  const version = 'v0';
  const body = request.rawBody.toString('utf-8');
  const timestamp = request.headers['X-Slack-Request-Timestamp'];
  const signBasestring = `${version}:${timestamp}:${body}`;

  const hash = hmac.update(signBasestring).digest('hex');
  const mySignature = `${version}=${hash}`;
  const slackSignature = request.headers['X-Slack-Signature'];
  
  if(mySignature !== slackSignature) {
    response.status(401).send();
    return;
  }

  const actionContent = JSON.parse(request.body.payload);

  const {
    actions,
    callback_id: callbackId,
    response_url: responseUrl
  } = actionContent;

  console.log("Incoming activity for", callbackId);

  switch (callbackId) {
    case "allow_hotline_answer": await onAllowHotlineAnswer(actions, responseUrl); break;
  }

  response.status(200).send();
}

export { postToSlack, postReplyToSlack, answerDirectly, onSlackInteraction };
