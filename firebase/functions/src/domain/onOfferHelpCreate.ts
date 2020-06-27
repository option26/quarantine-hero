import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { sendingMailsDisabledLogMessage, SEND_EMAILS } from '@config';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { AskForHelpCollectionEntry } from '@interface/collections/AskForHelpCollectionEntry';
import { OfferHelpCollectionEntry } from '@interface/collections/OfferHelpCollectionEntry';
import { CollectionName } from '@enum/CollectionName';

export async function onOfferHelpCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const parentPath = snap.ref.parent.path; // get the id
    const offerId = snap.id; // get the id
    const db = admin.firestore();
    const askForHelp = snap.ref.parent.parent;

    if (!askForHelp) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp} does not exist`);
      return;
    }

    const offer = await db.collection(parentPath).doc(offerId).get();
    const askRecord = await askForHelp.get();

    if (!askRecord || !askRecord.exists) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp.path} does not exist`);
      return;
    }

    const askRecordData = askRecord && askRecord.data() as AskForHelpCollectionEntry
    const { request, uid } = askRecordData.d;

    const data = await admin.auth().getUser(uid);
    const { email: receiver } = data.toJSON() as UserRecord;

    const offerRecordData = offer.data() as OfferHelpCollectionEntry;
    const { answer, email } = offerRecordData

    const sendgridOptions = {
      to: receiver,
      from: 'help@quarantaenehelden.org',
      templateId: 'd-ed9746e4ff064676b7df121c81037fab',
      replyTo: { email },
      hideWarnings: true, // removes triple bracket warning
      dynamic_template_data: {
        subject: 'QuarantäneHeld*innen - Jemand hat Dir geschrieben!',
        answer,
        email,
        request,
        askForHelpLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelp.id}`,
      }
    };

    // eslint-disable-next-line no-console
    console.log(sendgridOptions);

    try {
      if (SEND_EMAILS) {
        // without "any" casting, sendgrid complains about sendgridOptions typing
        await sgMail.send(sendgridOptions as any);
      } else {
        // eslint-disable-next-line no-console
        console.log(sendingMailsDisabledLogMessage);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      if (err.response && err.response.body && err.response.body.errors) {
        // eslint-disable-next-line no-console
        console.warn(err.response.body.errors);
      }
    }

    await db.collection(CollectionName.AskForHelp).doc(askRecord.id).update({
      'd.responses': admin.firestore.FieldValue.increment(1),
    });
    await db.collection(CollectionName.Stats).doc('external').update({
      offerHelp: admin.firestore.FieldValue.increment(1),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
