import * as admin from 'firebase-admin';

import {
  MINIMUM_NOTIFICATION_DELAY_UNTIL_FURTHER_ENGAGEMENT_WITH_OPEN_ENTRIES_DAYS,
  MAXIMUM_ALLOWED_AGE_FOR_ENTRY_TO_BE_ASK_FOR_RE_ENGAGEMENT_DAYS,
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '@config';

import { sendEmailToUser } from '@utilities/email/sendEmailToUser';

import { AskForHelpCollectionEntry } from '@interface/collections/AskForHelpCollectionEntry';
import { SendgridTemplateData } from '@interface/email/SendgridTemplateData';
import { CollectionName } from '@enum/CollectionName';

export async function searchAndSendNotificationEmailsForOpenOffersWithAnswers(): Promise<void> {
  try {
    const db = admin.firestore();
    const openAskForHelpSnapsWithAnswers = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '<=', Date.now() - MAXIMUM_ALLOWED_AGE_FOR_ENTRY_TO_BE_ASK_FOR_RE_ENGAGEMENT_DAYS * 24 * 60 * 60 * 1000)
      .where('d.timeStamp', '<=', Date.now() - MINIMUM_NOTIFICATION_DELAY_UNTIL_FURTHER_ENGAGEMENT_WITH_OPEN_ENTRIES_DAYS * 24 * 60 * 60 * 1000)
      .where('d.responses', '>', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('openAskForHelpSnapsWithAnswers: Requests to execute', openAskForHelpSnapsWithAnswers.docs.length);
    // RUN SYNC
    const asyncOperations = openAskForHelpSnapsWithAnswers.docs.map(async (askForHelpSnap) => {
      const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
      const askForHelpId = askForHelpSnap.id;
      // eslint-disable-next-line no-console
      console.log('askForHelpId', askForHelpId);
      // eslint-disable-next-line no-console
      if (SEND_EMAILS) {
        const templateId = 'd-7f2169b45d11468997a187778a6cde1f';
        const templateData: SendgridTemplateData = {
          subject: 'QuarantäneHeld*innen - Wurde Dir geholfen?',
          request: askForHelpSnapData.d.request,
          location: askForHelpSnapData.d.location,
          link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
          solveLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&solve=true`,
          requestMoreHelpLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&moreHelp=true`,
          deleteLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&delete=true`,
        };
        const email = await sendEmailToUser(askForHelpSnapData.d.uid, templateId, templateData);
        return email;
      }
      // eslint-disable-next-line no-console
      console.log(sendingMailsDisabledLogMessage);
      return null;
    });
    const result = await Promise.all(asyncOperations);
    console.log('result', result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
