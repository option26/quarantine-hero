import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import templates from '../templates';
import { convert } from 'html-to-text';

import {
  SEND_EMAILS, SMTP_HOST, SMTP_PORT, MAIL_SECURE, SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL,
} from '../config';

import { CollectionName } from '../types/enum/CollectionName';
import { TemplateData } from '../types/interface/email/TemplateData';
import { MailCollectionEntry } from '../types/interface/collections/MailCollectionEntry';
import { TemplateId } from '../types/enum/TemplateId';

/*
 * This function regular checks if there are unsent emails and sends them off
 */
export async function sendEmails(): Promise<void> {
  try {
    const db = admin.firestore();

    const mailsToSendQueryResult: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db.collection(CollectionName.Mails)
      .where('sendSuccess', '==', false)
      .where('sendAttempts', '<=', 10)
      .limit(200) // mailgun api limit is 300 requests / minute
      .get();

    // eslint-disable-next-line no-console
    console.log('Sending pending emails', mailsToSendQueryResult.docs.length);

    if (SEND_EMAILS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: MAIL_SECURE, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      });

      for (const mailDoc of mailsToSendQueryResult.docs) {
        const mail = mailDoc.data() as MailCollectionEntry;
        const html = compileHTML(mail.templateId, mail.templateData);
        // send mail with defined transport object
        try {
          await transporter.sendMail({
            from: SENDER_EMAIL, // sender address
            to: mail.receiver, // list of receivers
            replyTo: mail.replyTo ?? SENDER_EMAIL,
            subject: mail.subject, // Subject line
            text: convert(html), // plain text body
            html: html, // html body
          });

          // update local entry with result
          await mailDoc.ref.update({
            'sendDate': Date.now(),
            'sendSuccess': true,
            'sendAttempts': admin.firestore.FieldValue.increment(1),
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          await mailDoc.ref.update({
            'sendAttempts': admin.firestore.FieldValue.increment(1),
          });
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function compileHTML(templateId: TemplateId, templateData: TemplateData): string {
  return templates[templateId](templateData);
}
