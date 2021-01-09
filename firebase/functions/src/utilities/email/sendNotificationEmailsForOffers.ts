import * as admin from 'firebase-admin';

import { sendEmailToUser } from './sendEmailToUser';

import { NotificationsCollectionEntry } from '../../types/interface/collections/NotificationsCollectionEntry';
import { SendgridTemplateData } from '../../types/interface/email/SendgridTemplateData';
import { CollectionName } from '../../types/enum/CollectionName';

export async function sendNotificationEmailsForOffers(
  db: FirebaseFirestore.Firestore,
  eligibleHelpOffers: NotificationsCollectionEntry['d'][],
  askForHelpId: string,
  templateId: string,
  templateData: SendgridTemplateData
): Promise<void> {
  const result = await Promise.all(eligibleHelpOffers.map(async (offerDoc: NotificationsCollectionEntry['d']) => {
    try {
      const { uid } = offerDoc;

      const email = await sendEmailToUser(uid, templateId, templateData);

      await db.collection(CollectionName.AskForHelp).doc(askForHelpId).update({
        'd.notificationCounter': admin.firestore.FieldValue.increment(1),
        'd.notificationReceiver': admin.firestore.FieldValue.arrayUnion(uid),
      });
      return { askForHelpId, email };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      if (err.response && err.response.body && err.response.body.errors) {
        // eslint-disable-next-line no-console
        console.warn(err.response.body.errors);
      }
      return null;
    }
  }));
  // eslint-disable-next-line no-console
  console.log(result);
}
