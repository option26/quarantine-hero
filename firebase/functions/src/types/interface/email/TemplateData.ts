import { AskForHelpCollectionEntry } from '../collections/AskForHelpCollectionEntry';

export type TemplateData =
  HotlineTemplateData
  | RequestInYourAreaTemplateData
  | OffersWithoutAnswersTemplateData
  | OffersWithAnswersTemplateData
  | OfferHelpTemplateData
  | AskForHelpTemplateData;

export interface HotlineTemplateData {
  askForHelpLink: string;
  phoneNr: string;
  comment?: string;
}

export interface RequestInYourAreaTemplateData {
  request: AskForHelpCollectionEntry['request'];
  location: AskForHelpCollectionEntry['location'];
  link: string;
  reportLink: string;
}

export interface OffersWithoutAnswersTemplateData {
  request: AskForHelpCollectionEntry['request'];
  location: AskForHelpCollectionEntry['location'];
  requestMoreHelpLink: string;
  deleteLink: string;
}

export interface OffersWithAnswersTemplateData {
  request: AskForHelpCollectionEntry['request'];
  location: AskForHelpCollectionEntry['location'];
  solveLink: string;
  requestMoreHelpLink: string;
  deleteLink: string;
}

export interface OfferHelpTemplateData {
  answer: string;
  email: string;
  request: AskForHelpCollectionEntry['request'];
  askForHelpLink: string;
}

export interface AskForHelpTemplateData {
  request: AskForHelpCollectionEntry['request'];
  location: AskForHelpCollectionEntry['location'];
  link: string;
  reportLink: string;
}
