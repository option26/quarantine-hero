import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { sendingMailsDisabledLogMessage, SEND_EMAILS } from '../config';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { OfferHelpCollectionEntry } from '../types/interface/collections/OfferHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { postReplyToSlack } from '../utilities/slack';

export async function onOfferHelpCreate(offer: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const askForHelp = offer.ref.parent.parent;

    if (!askForHelp) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp} does not exist`);
      return;
    }

    const askRecord = await askForHelp.get();

    if (!askRecord || !askRecord.exists) {
      // eslint-disable-next-line no-console
      console.error(`ask-for-help at ${askForHelp.path} does not exist`);
      return;
    }

    const askRecordData = askRecord && askRecord.data() as AskForHelpCollectionEntry;
    const { request, uid } = askRecordData.d;

    const data = await admin.auth().getUser(uid);
    const { email: receiver } = data.toJSON() as UserRecord;

    const offerRecordData = offer.data() as OfferHelpCollectionEntry;
    const { answer, email } = offerRecordData;

    if (askRecordData.d.isHotline) {
      // Send direct response to help offeree with hotline contact data
      const hotlineDoc = await askForHelp.collection('hotline').get().then(snap => snap.docs.length > 0 ? snap.docs[0].data() : undefined);
      if (!hotlineDoc) {
        try {
          const message = 'Fehler! Antwort für Hotline-Inserat erhalten aber keine Kontaktinformationen für Hilfesuchende*n gefunden.';
          await postReplyToSlack(askRecordData.d.slackMessageRef, message, true);
        } catch (err) {
          console.log('Error posting to slack', err);
        }
        return;
      }

      const { phoneNr, response } = hotlineDoc;

      const sendgridResponseOptions = {
        to: email,
        from: 'help@quarantaenehelden.org',
        templateId: 'd-486c10fbe4e645a39be22f266dea5523',
        hideWarnings: true, // removes triple bracket warning
        dynamic_template_data: {
          subject: 'QuarantäneHeld*innen - Telefonisch kontaktieren!',
          phoneNr,
          response,
        }
      };

      // eslint-disable-next-line no-console
      console.log(sendgridResponseOptions);

      try {
        if (SEND_EMAILS) {
          // without "any" casting, sendgrid complains about sendgridOptions typing
          await sgMail.send(sendgridResponseOptions as any);
          try {
            const message = 'Automatische Antwort für Hotline-Inserat gesendet.';
            await postReplyToSlack(askRecordData.d.slackMessageRef, message);
          } catch (err) {
            console.log('Error posting to slack', err);
          }
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
    } else {
      // Send email to ask-for-help creator
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
    console.log('ID', offer.id);
  }
}
