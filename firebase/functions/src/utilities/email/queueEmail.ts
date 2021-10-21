import * as admin from 'firebase-admin';

import { TemplateData } from '../../types/interface/email/TemplateData';
import { CollectionName } from "../../types/enum/CollectionName";
import { TemplateId } from "../../types/enum/TemplateId";
import { MailCollectionEntry } from "../../types/interface/collections/MailCollectionEntry";

interface MailData {
  receiver: string;
  subject: string;
  templateId: TemplateId;
  templateData: TemplateData;
  replyTo?: string;
}

export async function queueEmail(data: MailData): Promise<void> {
  const db = admin.firestore();
  await db.collection(CollectionName.Mails).add({
    ...data,
    sendSuccess: false,
    sendDate: -1,
    sendAttempts: 0
  } as MailCollectionEntry);
}
