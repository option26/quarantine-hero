
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { AskForHelpCollectionEntry } from '@interface/collections/AskForHelpCollectionEntry';
import { NotificationsCollectionEntry } from '@interface/collections/NotificationsCollectionEntry';
import { CollectionName } from '@enum/CollectionName';


export async function sendNotificationEmailsForOffers(db: FirebaseFirestore.Firestore, eligibleHelpOffers: NotificationsCollectionEntry['d'][], askForHelpSnapData: AskForHelpCollectionEntry, askForHelpId: string): Promise<void> {
  const result = await Promise.all(eligibleHelpOffers.map(async (offerDoc: NotificationsCollectionEntry['d']) => {
    try {
      const { uid } = offerDoc;
      const offeringUser = await admin.auth().getUser(uid);
      const { email } = offeringUser.toJSON() as UserRecord;
      const sendgridOptions = {
        to: email,
        from: 'help@quarantaenehelden.org',
        templateId: 'd-9e0d0ec8eda04c9a98e6cb1edffdac71',
        dynamic_template_data: {
          subject: 'QuarantäneHeld*innen - Jemand braucht Deine Hilfe!',
          request: askForHelpSnapData.d.request,
          location: askForHelpSnapData.d.location,
          link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
          reportLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}?report`,
        },
        hideWarnings: true, // removes triple bracket warning
      };
      // without "any" casting, sendgrid complains about sendgridOptions typing
      await sgMail.send(sendgridOptions as any);

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
