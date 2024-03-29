import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import axios from 'axios';
import { answerDirectly, postReplyToSlack } from '../utilities/slack';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';
import { OfferHelpCollectionEntry } from '../types/interface/collections/OfferHelpCollectionEntry';
import { HotlineCollectionEntry } from '../types/interface/collections/HotlineCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { TemplateId } from "../types/enum/TemplateId";
import { queueEmail } from "../utilities/email/queueEmail";

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

    try {
      // Update counters
      await db.collection(CollectionName.AskForHelp).doc(askRecord.id).update({
        'd.responses': admin.firestore.FieldValue.increment(1),
      });
      await db.collection(CollectionName.Stats).doc('external').update({
        offerHelp: admin.firestore.FieldValue.increment(1),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      if (err.response && err.response.body && err.response.body.errors) {
        // eslint-disable-next-line no-console
        console.warn(err.response.body.errors);
      }
    }

    if (askRecordData.d.isHotline) {
      await askAllowHotlineAnswer(askRecordData.d.slackMessageRef, askForHelp.id, offer.id, email, answer);

      // Early return as we don't need to send an email notifaction to the hotline operators
      return;
    }

    if (!receiver) {
      console.error('Receiving user has no email');
      return;
    }

    // Send email to ask-for-help creator
    await queueEmail({
      receiver,
      replyTo: email,
      templateId: TemplateId.TemplateForOfferHelp,
      subject: 'QuarantäneHeld*innen - Jemand hat Dir geschrieben!',
      templateData: {
        answer,
        email,
        request,
        askForHelpLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelp.id}`,
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', offer.id);
  }
}

async function askAllowHotlineAnswer(messageRef: string | undefined, askForHelpId: string, offerHelpId: string, email: string, answer: string): Promise<void> {
  if (!messageRef) {
    console.warn('No message ref passed');
    return;
  }

  const slackMessageData = {
    channel: functions.config().slack.channel,
    thread_ts: messageRef,
    text: `<!subteam^${functions.config().slack.group}> Es gab eine Antwort von ${email} auf die Hotline-Anfrage: \n>${answer.replace(/\n/g, '\n>')}`,
    attachments: [
      {
        text: 'Automatische Antwort jetzt senden?',
        fallback: 'Da ist wohl etwas schief gelaufen :(',
        callback_id: 'allow_hotline_answer',
        color: '#e33ad2',
        attachment_type: 'default',
        actions: [
          {
            name: 'allow_answer',
            text: 'Ja',
            type: 'button',
            value: `true|${askForHelpId}|${offerHelpId}`
          },
          {
            name: 'allow_answer',
            text: 'Nein',
            type: 'button',
            value: `false|${askForHelpId}|${offerHelpId}`
          }
        ]
      }
    ]
  };

  try {
    await axios({
      method: 'POST',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${functions.config().slack.token}`,
      },
      data: slackMessageData,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
    if (err.response && err.response.body && err.response.body.errors) {
      // eslint-disable-next-line no-console
      console.warn(err.response.body.errors);
    }
  }
}

// Accepts callbacks from slack when asked
// if an email should be sent to a person who has offered to help
// on a request that has been submitted via the hotline
export async function onAllowHotlineAnswer(actions: Array<{ value: string }>, responseUrl: string): Promise<void> {
  try {
    const { value } = actions[0];
    const [response, askForHelpId, offerHelpId] = value.split('|');
    const allowed = response === 'true';

    if (allowed) {
      await sendAutomaticReplyToHelper(askForHelpId, offerHelpId);
    }

    const allowedResponse = 'Es wurde eine Email mit der Telefonnummer an den Helfenden gesendet.';
    const forbiddenResponse = 'Es wurde keine Email an den Helfenden gesendet.';
    await answerDirectly(allowed ? allowedResponse : forbiddenResponse, responseUrl);
  } catch (err) {
    console.log('Error sending automatic response to request', err);

    await answerDirectly(`Fehler beim Senden der automatischen Email: ${err}`, responseUrl);
  }
}

// Sends an email to the person who has responded with
// an offerHelp to an askForHelp, telling them that
// the person is only reachable via phone and that they
// should reach out to this person personally with a phone-call
async function sendAutomaticReplyToHelper(askForHelpId: string, offerHelpId: string): Promise<void> {
  const db = admin.firestore();

  const askForHelpRef = db.collection('ask-for-help').doc(askForHelpId);
  const askForHelpData = await askForHelpRef.get().then(snap => snap.data() as AskForHelpCollectionEntry);

  // we take the hotline document at index zero because there should only ever be one hotline document within this nested collection
  const hotlineData = await askForHelpRef.collection('hotline').get().then(snap => snap.docs.length > 0 ? snap.docs[0].data() as HotlineCollectionEntry : undefined);

  const offerHelpRef = askForHelpRef.collection('offer-help').doc(offerHelpId);
  const offerHelpData = await offerHelpRef.get().then(snap => snap.data() as OfferHelpCollectionEntry);


  if (!hotlineData) {
    try {
      const message = 'Fehler! Antwort für Hotline-Inserat erhalten aber keine Kontaktinformationen für Hilfesuchende*n gefunden.';
      await postReplyToSlack(askForHelpData.d.slackMessageRef, message, true);
    } catch (err) {
      console.log('Error posting to slack', err);
    }
    return;
  }

  const { phoneNr, comment } = hotlineData;

  await queueEmail({
    receiver: offerHelpData.email,
    templateId: TemplateId.TemplateForHotlineContact,
    subject: 'QuarantäneHeld*innen - Telefonisch kontaktieren!',
    templateData: {
      askForHelpLink: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpRef.id}`,
      phoneNr,
      comment,
    }
  });
}
