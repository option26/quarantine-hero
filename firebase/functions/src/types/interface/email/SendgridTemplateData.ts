import { AskForHelpCollectionEntry } from '../../interface/collections/AskForHelpCollectionEntry';

export interface SendgridTemplateData {
  subject: string;
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  link: string;
  reportLink?: string;
  solveLink?: string;
  requestMoreHelpLink?: string;
  deleteLink?: string;
}
