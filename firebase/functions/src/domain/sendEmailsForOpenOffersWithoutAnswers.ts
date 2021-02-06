import * as admin from 'firebase-admin';

import {
  MINIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_FOLLOWUP_DELAY_DAYS,
  MAXIMUM_ALLOWED_REQUESTS_FOR_HELP,
  MORE_HELP_REQUEST_COOLDOWN_DAYS,
  ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS
} from '../config';

import { sendEmailForAskForHelpEntries } from '../utilities/email/sendEmailForAskForHelpEntries';

import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { SendgridTemplateId } from '../types/enum/SendgridTemplateId';

/*
  * With this function, we send emails to the authors of open help entries who have not received any answers yet, and ask whether they are still in need for help
  * the goal is to make sure that everyone in need gets the required help
  * in this case, the users received no initial answers
  * we therefore ask them whether their issue is still relevant, or whether they already received help another way
  * as long as the request is open and has no answers, it indicates that the user still might need help.
*/
export async function sendEmailsForOpenOffersWithoutAnswers(): Promise<void> {
  try {
    const db = admin.firestore();
    const now = Date.now();
    const askForHelpSnapsWithoutAnswers: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db.collection(CollectionName.AskForHelp)
      .where('d.timestamp', '>=', now - MAXIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.timestamp', '<=', now - MINIMUM_FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000)
      .where('d.responses', '==', 0)
      .get();

    const eligibleAskForHelpSnapsWithoutAnswers = askForHelpSnapsWithoutAnswers.docs.filter((snap) => {
      const data = snap.data() as AskForHelpCollectionEntry;
      const { lastHelpRequestTimestamps, timestampLastEngagementAttempt } = data.d;
      if (lastHelpRequestTimestamps === undefined || lastHelpRequestTimestamps.length >= MAXIMUM_ALLOWED_REQUESTS_FOR_HELP) {
        return false;
      }

      const [lastHelpRequested] = lastHelpRequestTimestamps.slice(-1);
      const userWasContactedRecently = timestampLastEngagementAttempt
        ? timestampLastEngagementAttempt <= now - ENGAGEMENT_ATTEMPT_COOLDOWN_HOURS * 60 * 60 * 1000
        : false;
      return !userWasContactedRecently && lastHelpRequested <= now - MORE_HELP_REQUEST_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    });

    // eslint-disable-next-line no-console
    console.log('askForHelpSnapsWithoutAnswers: Requests to execute', eligibleAskForHelpSnapsWithoutAnswers.length);
    const templateId = SendgridTemplateId.TemplateForOffersWithoutAnswers;
    await sendEmailForAskForHelpEntries(eligibleAskForHelpSnapsWithoutAnswers, templateId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
