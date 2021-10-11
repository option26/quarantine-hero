import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MORE_HELP_REQUEST_COOLDOWN_DAYS,
  ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS
} from '../config';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import axios from 'axios';

/*
  * with this function, we send notifications to slack for our hotline requests, adding a modal to increase the reach for the posting
*/
export async function sendNotificationsForHotlineRequests(): Promise<void> {
  try {
    const db = admin.firestore();
    const now = Date.now();
    const askForHelpSnapsHotline: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '>=', now - MAXIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.timestamp', '<=', now - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.isHotline', '==', true)
      .get();

    const eligibleAskForHelpSnapsHotline = askForHelpSnapsHotline.docs.filter((snap) => {
      const data = snap.data() as AskForHelpCollectionEntry;
      const { lastHelpRequestTimestamps, timestampLastEngagementAttempt } = data.d;
      if (lastHelpRequestTimestamps === undefined || lastHelpRequestTimestamps.length >= MAXIMUM_ALLOWED_REQUESTS_FOR_HELP) {
        return false;
      }

      const [lastHelpRequested] = lastHelpRequestTimestamps.slice(-1);
      const userWasContactedRecently = timestampLastEngagementAttempt
        ? timestampLastEngagementAttempt >= now - ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS * 60 * 60 * 1000
        : false;
      return !userWasContactedRecently && lastHelpRequested <= now - MORE_HELP_REQUEST_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    });

    // eslint-disable-next-line no-console
    console.log('eligibleAskForHelpSnapsHotline: Requests to execute', eligibleAskForHelpSnapsHotline.length);

    for (const eligibleAskForHelpSnap of eligibleAskForHelpSnapsHotline) {
      const data = eligibleAskForHelpSnap.data() as AskForHelpCollectionEntry;
      await askForReachIncrease(data.d.slackMessageRef, eligibleAskForHelpSnap.id);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function askForReachIncrease(messageRef: string | undefined, askForHelpId: string): Promise<void> {
  if (!messageRef) {
    console.warn('No message ref passed');
    return;
  }

  const slackMessageData = {
    channel: functions.config().slack.channel,
    thread_ts: messageRef,
    text: `<!subteam^${functions.config().slack.group}> Soll die Reichweite für dieses Inserat erhöht werden?`,
    attachments: [
      {
        text: 'Reichweite erhöhen?',
        fallback: 'Da ist wohl etwas schief gelaufen :(',
        callback_id: 'increase_reach',
        color: '#e33ad2',
        attachment_type: 'default',
        actions: [{
          name: 'allow_answer',
          text: 'Ja',
          type: 'button',
          value: `true|${askForHelpId}`
        },
        {
          name: 'allow_answer',
          text: 'Nein',
          type: 'button',
          value: `false|${askForHelpId}`
        }]
      }
    ]
  };

  try {
    await axios({
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${functions.config().slack.token}`,
      },
      data: slackMessageData,
    });

    // Prevent multiple notifications
    const db = admin.firestore();
    const document = db.collection(CollectionName.AskForHelp).doc(askForHelpId);
    const updatedData = {
      'd.timestampLastEngagementAttempt': Date.now(),
    };
    await document.update(updatedData);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
    if (err.response && err.response.body && err.response.body.errors) {
      // eslint-disable-next-line no-console
      console.warn(err.response.body.errors);
    }
  }
}
