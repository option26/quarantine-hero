import axios from 'axios';
import * as functions from 'firebase-functions';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';

async function postToSlack(snapId: string, snapData: AskForHelpCollectionEntry): Promise<string> {
  const { request, plz, location } = snapData.d;

  const response = await axios({
    method: 'POST',
    url: 'https://slack.com/api/chat.postMessage',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${functions.config().slack.token}`,
    },
    data: {
      channel: functions.config().slack.channel,
      text: `https://www.quarantaenehelden.org/#/offer-help/${snapId}\n${plz} - ${location}\n>${request.replace('\n', '\n>')}`,
    },
  });

  return response.data.ts;
}

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

export { postToSlack, postReplyToSlack };
