import * as admin from 'firebase-admin';

import { TemplateData } from '../../types/interface/email/TemplateData';
import { queueEmail } from './queueEmail';
import { TemplateId } from '../../types/enum/TemplateId';

export async function sendEmailToUser(uid: string, templateId: TemplateId, templateData: TemplateData, subject: string): Promise<void> {
  const { email } = await admin.auth().getUser(uid);
  if (email === undefined) {
    console.log(`No email address found for user ${uid}`);
    return;
  }
  await queueEmail({ receiver: email, subject, templateId, templateData });
}
