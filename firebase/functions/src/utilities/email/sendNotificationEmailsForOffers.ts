import * as admin from 'firebase-admin';

import { sendEmailToUser } from './sendEmailToUser';

import { NotificationsCollectionEntry } from '../../types/interface/collections/NotificationsCollectionEntry';
import { TemplateData } from '../../types/interface/email/TemplateData';
import { CollectionName } from '../../types/enum/CollectionName';
import { TemplateId } from "../../types/enum/TemplateId";

export async function sendNotificationEmailsForOffers(
  db: FirebaseFirestore.Firestore,
  eligibleHelpOffers: NotificationsCollectionEntry[],
  askForHelpId: string,
  templateId: TemplateId,
  templateData: TemplateData,
  subject: string,
  transaction?: FirebaseFirestore.Transaction
): Promise<void> {
  await Promise.all(eligibleHelpOffers.map(async (offerDoc: NotificationsCollectionEntry) => {
    try {
      const { uid } = offerDoc;

      await sendEmailToUser(uid, templateId, templateData, subject);

      const document = db.collection(CollectionName.AskForHelp).doc(askForHelpId);

      const updatedData = {
        'notificationCounter': admin.firestore.FieldValue.increment(1),
        'notificationReceiver': admin.firestore.FieldValue.arrayUnion(uid),
      };

      if (transaction) {
        await transaction.update(document, updatedData);
        return;
      }

      await document.update(updatedData);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      if (err.response && err.response.body && err.response.body.errors) {
        // eslint-disable-next-line no-console
        console.warn(err.response.body.errors);
      }
    }
  }));
}
