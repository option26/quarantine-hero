import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { SendgridTemplateData } from '../../types/interface/email/SendgridTemplateData';

export async function sendEmailToUser(uid: string, templateId: string, templateData: SendgridTemplateData): Promise<void> {
  const { email } = await admin.auth().getUser(uid);
  if (email === undefined) {
    console.log(`No email address found for user ${uid}`);
    return;
  }
  const sendgridOptions = {
    to: email,
    from: 'help@quarantaenehelden.org',
    templateId,
    dynamic_template_data: templateData,
    hideWarnings: true, // removes triple bracket warning
  };
  // without "any" casting, sendgrid complains about sendgridOptions typing
  await sgMail.send(sendgridOptions as any);
}
