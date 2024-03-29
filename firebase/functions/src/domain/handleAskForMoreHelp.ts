import * as admin from 'firebase-admin';

import { getEligibleHelpOffers } from '../utilities/email/getEligibleHelpOffers';
import { sendNotificationEmailsForOffers } from '../utilities/email/sendNotificationEmailsForOffers';
import { postReplyToSlack } from '../utilities/slack';

import {
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MORE_HELP_REQUEST_COOLDOWN_DAYS,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage
} from '../config';

import { CallableContext } from 'firebase-functions/lib/providers/https';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { TemplateId } from "../types/enum/TemplateId";

export async function handleAskForMoreHelp(askForHelpId: string, context: CallableContext): Promise<void> {
  if (askForHelpId === undefined || context.auth === undefined || context.auth === null) {
    throw Error('Bad Request');
  }

  const { uid } = context.auth;
  await askForMoreHelp(askForHelpId, uid);
}

export async function askForMoreHelp(askForHelpId: string, uid: string): Promise<void> {
  const db = admin.firestore();

  try {
    const transaction = buildTransaction(askForHelpId, uid);
    await db.runTransaction(transaction);

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', askForHelpId);
    // we need to throw this error here, because otherwise the user will see a success message in the UI.
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

    const { uid, lastHelpRequestTimestamps } = askForHelpData.d;
    if (lastHelpRequestTimestamps === undefined) {
      throw new Error('Last help request timestamp not set');
    }

    const [timeStampLastHelpRequest] = lastHelpRequestTimestamps.slice(-1);
    // early return if the user does not request help or is not eligible for more help
    if (lastHelpRequestTimestamps.length >= MAXIMUM_ALLOWED_REQUESTS_FOR_HELP) {
      console.log('Maximum amount of allowed request reached for user', uid, askForHelpId);
      throw new Error('Maximum amount of allowed request reached');
    }
    if (timeStampLastHelpRequest >= Date.now() - MORE_HELP_REQUEST_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
      console.log('User is attempting to request help again within the cool down period', timeStampLastHelpRequest, uid, askForHelpId);
      throw new Error('Cool down active, please wait');
    }

    const { initialSize, eligibleHelpOffers } = await getEligibleHelpOffers(db, askForHelpId, askForHelpData);
    // eslint-disable-next-line no-console
    console.log('askForHelpId', askForHelpId);
    // eslint-disable-next-line no-console
    console.log('eligibleHelpOffers', eligibleHelpOffers.length);
    if (SEND_EMAILS) {
      const templateId = TemplateId.TemplateForAskForHelp;
      const subject = 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!';
      const templateData = {
        request: askForHelpData.d.request,
        location: askForHelpData.d.location,
        link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
        reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
      };
      await sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpId, templateId, templateData, subject, transaction);
      try {
        const message = `Mehr Hilfe gesucht\nPotentielle Helfende: ${initialSize}\nGesendete Emails: ${eligibleHelpOffers.length}`;
        await postReplyToSlack(askForHelpData.d.slackMessageRef, message, true);
      } catch (err) {
        console.log('Error posting to slack', err);
      }

    } else {
      try {
        const message = `Mehr Hilfe gesucht\nPotentielle Helfende: ${initialSize}\nEmails deaktiviert!`;
        await postReplyToSlack(askForHelpData.d.slackMessageRef, message, true);
      } catch (err) {
        console.log('Error posting to slack', err);
      }

      // eslint-disable-next-line no-console
      console.log(sendingMailsDisabledLogMessage);
    }
    return transaction.update(askForHelpDoc, {
      'd.lastHelpRequestTimestamps': admin.firestore.FieldValue.arrayUnion(Date.now()),
    });
  };
}
