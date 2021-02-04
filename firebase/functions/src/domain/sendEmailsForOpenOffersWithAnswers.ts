import * as admin from 'firebase-admin';

import {
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MORE_HELP_REQUEST_COOLDOWN_DAYS,
  ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS,
} from '../config';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
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
    const now = Date.now();

    const askForHelpSnapsWithAnswers: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '>=', now - MAXIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.timestamp', '<=', now - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .get();

    const eligibleAskForHelpSnapsWithAnswers = askForHelpSnapsWithAnswers.docs.filter((snap) => {
      const data = snap.data() as AskForHelpCollectionEntry;
      // we need to perform local filtering due to inequality filters
      const { lastHelpRequestTimestamps, notificationCounter, responses, timestampLastEngagementAttempt } = data.d;
      if (
        lastHelpRequestTimestamps === undefined
        || notificationCounter >= MAXIMUM_ALLOWED_REQUESTS_FOR_HELP
        || !responses // Filters for undefined or zero responses
      ) {
        return false;
      }

      const [lastHelpRequested] = lastHelpRequestTimestamps.slice(-1);
      const userWasContactedRecently = timestampLastEngagementAttempt
        ? timestampLastEngagementAttempt <= now - ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS * 60 * 60 * 1000
        : false;
      return !userWasContactedRecently && lastHelpRequested <= now - MORE_HELP_REQUEST_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    });

    // eslint-disable-next-line no-console
    console.log('openAskForHelpSnapsWithAnswers: Requests to execute', eligibleAskForHelpSnapsWithAnswers.length);
    const templateId = SendgridTemplateId.TemplateForOffersWithAnswers;
    await sendEmailForAskForHelpEntries(eligibleAskForHelpSnapsWithAnswers, templateId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
