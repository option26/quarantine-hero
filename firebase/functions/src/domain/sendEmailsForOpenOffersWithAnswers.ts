import * as admin from 'firebase-admin';

import {
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_AGE_FOR_RE_ENGAGEMENT_DAYS,
} from '../config';

import { CollectionName } from '../types/enum/CollectionName';
import { sendEmailForAskForHelpEntries } from '../utilities/email/sendEmailForAskForHelpEntries';
import { SendgridTemplateId } from '../types/enum/SendgridTemplateId';

/*
  * With this function, we send emails to the authors of open help entries with answers, and ask whether they are still in need for help
  * the goal is to make sure that everyone in need gets the required help
  * in this case, the users received some initial answers, but has not set the entry to solved yet
  * as long as the request is open, it indicates that the user still might need help.
*/

export async function sendEmailsForOpenOffersWithAnswers(): Promise<void> {
  try {
    const db = admin.firestore();
    const openAskForHelpSnapsWithAnswers = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '>=', Date.now() - MAXIMUM_AGE_FOR_RE_ENGAGEMENT_DAYS * 24 * 60 * 60 * 1000)
      .where('d.timestamp', '<=', Date.now() - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.responses', '>', 0)
      .limit(3)
      .get();

    // eslint-disable-next-line no-console
    console.log('openAskForHelpSnapsWithAnswers: Requests to execute', openAskForHelpSnapsWithAnswers.docs.length);
    const templateId = SendgridTemplateId.HaveYouReceivedHelp;
    await sendEmailForAskForHelpEntries(openAskForHelpSnapsWithAnswers, templateId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
