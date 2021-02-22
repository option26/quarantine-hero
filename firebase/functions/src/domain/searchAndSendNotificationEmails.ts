import * as admin from 'firebase-admin';

import { getEligibleHelpOffers } from '../utilities/email/getEligibleHelpOffers';
import { sendNotificationEmailsForOffers } from '../utilities/email/sendNotificationEmailsForOffers';

import {
  MINIMUM_NOTIFICATION_DELAY_MINUTES,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '../config';

import { postReplyToSlack } from '../utilities/slack';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { SendgridTemplateData } from '../types/interface/email/SendgridTemplateData';
import { CollectionName } from '../types/enum/CollectionName';

export async function searchAndSendNotificationEmails(): Promise<void> {
  try {
    const db = admin.firestore();
    const askForHelpSnaps = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY_MINUTES * 60 * 1000)
      .where('d.notificationCounter', '==', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('askForHelp Requests to execute', askForHelpSnaps.docs.length);
    // RUN SYNC
    const asyncOperations = askForHelpSnaps.docs.map(async (askForHelpSnap) => {
      const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
      const askForHelpId = askForHelpSnap.id;
      const { initialSize, eligibleHelpOffers } = await getEligibleHelpOffers(db, askForHelpId, askForHelpSnapData);
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      console.log('eligibleHelpOffers', eligibleHelpOffers.length);
      if (SEND_EMAILS) {
        const templateId = 'd-9e0d0ec8eda04c9a98e6cb1edffdac71';
        const templateData: SendgridTemplateData = {
          subject: 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!',
          request: askForHelpSnapData.d.request,
          location: askForHelpSnapData.d.location,
          link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
          reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
        };

        try {
          const message = `Potentielle Helfende: ${initialSize}\nGesendete Emails: ${eligibleHelpOffers.length}`;
          await postReplyToSlack(askForHelpSnapData.d.slackMessageRef, message);
        } catch (err) {
          console.log('Error posting to slack', err);
        }

        return sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpId, templateId, templateData);
      }

      try {
        const message = `Potentielle Helfende: ${initialSize}\nEmails deaktiviert!`;
        await postReplyToSlack(askForHelpSnapData.d.slackMessageRef, message);
      } catch (err) {
        console.log('Error posting to slack', err);
      }

      // eslint-disable-next-line no-console
      console.log(sendingMailsDisabledLogMessage);
    });
    await Promise.all(asyncOperations);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}
