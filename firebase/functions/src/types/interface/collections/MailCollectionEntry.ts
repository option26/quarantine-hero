import { TemplateData } from '../email/TemplateData';
import { TemplateId } from "../../enum/TemplateId";

export interface MailCollectionEntry {
  sendSuccess: boolean;
  sendDate: number;
  sendAttempts: number;
  receiver: string;
  subject: string;
  templateId: TemplateId;
  templateData: TemplateData;
  replyTo?: string;
}
