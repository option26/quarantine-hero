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
import { RequestInYourAreaTemplateData } from '../types/interface/email/TemplateData';
import { CollectionName } from '../types/enum/CollectionName';
import { TemplateId } from '../types/enum/TemplateId';

export async function searchAndSendNotificationEmails(): Promise<void> {
  try {
    const db = admin.firestore();
    const askForHelpSnaps = await db.collection(CollectionName.AskForHelp)
      .where('timestamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY_MINUTES * 60 * 1000)
      .where('notificationCounter', '==', 0)
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
        const templateId = TemplateId.TemplateForAskForHelp;
        const templateData: RequestInYourAreaTemplateData = {
          request: askForHelpSnapData.request,
          location: askForHelpSnapData.location,
          link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
          reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
        };
        const subject = 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!';

        try {
          const message = `Potentielle Helfende: ${initialSize}\nGesendete Emails: ${eligibleHelpOffers.length}`;
          await postReplyToSlack(askForHelpSnapData.slackMessageRef, message);
        } catch (err) {
          console.log('Error posting to slack', err);
        }

        return sendNotificationEmailsForOffers(db, eligibleHelpOffers, askForHelpId, templateId, templateData, subject);
      }

      try {
        const message = `Potentielle Helfende: ${initialSize}\nEmails deaktiviert!`;
        await postReplyToSlack(askForHelpSnapData.slackMessageRef, message);
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
