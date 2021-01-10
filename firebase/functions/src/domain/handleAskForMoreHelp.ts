import * as admin from 'firebase-admin';

import { getEligibleHelpOffers } from '../utilities/email/getEligibleHelpOffers';
import { sendNotificationEmailsForOffers } from '../utilities/email/sendNotificationEmailsForOffers';
import { postReplyToSlack } from '../utilities/slack';

import {
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage
} from '../config';

import { CallableContext } from 'firebase-functions/lib/providers/https';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';


export async function handleAskForMoreHelp(askForHelpId: string, context: CallableContext): Promise<void> {
  if (askForHelpId !== undefined || context.auth === undefined || context.auth === null) {
    throw Error('Bad Request');
  }

  const db = admin.firestore();
  const { uid } = context.auth;

  try {
    const transaction = buildTransaction(askForHelpId, uid);
    await db.runTransaction(transaction);

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('An unknown error occurred');
  }
}

function buildTransaction(askForHelpId: string, requestUid: string): (transaction: FirebaseFirestore.Transaction) => Promise<FirebaseFirestore.Transaction> {
  const db = admin.firestore();

  return async (transaction: FirebaseFirestore.Transaction) => {
    const askForHelpDoc = db.collection(CollectionName.AskForHelp).doc(askForHelpId);
    const askForHelpData = await transaction.get(askForHelpDoc).then(snap => snap.data() as AskForHelpCollectionEntry);

    // Check if entry belongs to caller
    if (requestUid !== askForHelpData.d.uid) {
      throw new Error('Unauthorized');
    }

    const { uid, timeStampLastHelpRequest, notificationCounter } = askForHelpData.d;

    // early return if the user does not request help or is not eligible for more help
    if (notificationCounter >= MAXIMUM_ALLOWED_REQUESTS_FOR_HELP) {
      console.log('Maximum amount of allowed request reached for user', notificationCounter, uid, askForHelpId);
      throw new Error('Maximum amount of allowed request reached');
    }
    if (timeStampLastHelpRequest >= Date.now() - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000) {
      console.log('User is attempting to request help again within the cool down period', timeStampLastHelpRequest, uid, askForHelpId);
      throw new Error('Cool down active, please wait');
    }

    const { initialSize, eligibleHelpOffers } = await getEligibleHelpOffers(db, askForHelpId, askForHelpData);
    // eslint-disable-next-line no-console
    console.log('askForHelpId', askForHelpId);
    // eslint-disable-next-line no-console
    console.log('eligibleHelpOffers', eligibleHelpOffers.length);
    if (SEND_EMAILS) {
      const templateId = 'd-9e0d0ec8eda04c9a98e6cb1edffdac71';
      const templateData = {
        subject: 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!',
        request: askForHelpData.d.request,
        location: askForHelpData.d.location,
        link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
        reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
      };
      await sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpId, templateId, templateData);

      try {
        const message = `Mehr Hilfe gesucht\nPotentielle Helfende: ${initialSize}\nGesendete Emails: ${eligibleHelpOffers.length}`;
        await postReplyToSlack(askForHelpData.d.slackMessageRef, message);
      } catch (err) {
        console.log('Error posting to slack', err);
      }

    } else {
      try {
        const message = `Mehr Hilfe gesucht\nPotentielle Helfende: ${initialSize}\nEmails deaktiviert!`;
        await postReplyToSlack(askForHelpData.d.slackMessageRef, message);
      } catch (err) {
        console.log('Error posting to slack', err);
      }
    }

    // eslint-disable-next-line no-console
    console.log(sendingMailsDisabledLogMessage);

    return transaction.update(askForHelpDoc, {
      'd.notificationCounter': admin.firestore.FieldValue.increment(1),
      'd.timeStampLastHelpRequest': Date.now(),
    });
  };
}
