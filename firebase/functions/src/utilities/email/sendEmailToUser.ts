import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { SendgridTemplateData } from '../../types/interface/email/SendgridTemplateData';

export async function sendEmailToUser(uid: string, templateId: string, templateData: SendgridTemplateData): Promise<void> {
  const offeringUser = await admin.auth().getUser(uid);
  const { email } = offeringUser.toJSON() as UserRecord;
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
