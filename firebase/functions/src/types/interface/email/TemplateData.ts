import { AskForHelpCollectionEntry } from '../../interface/collections/AskForHelpCollectionEntry';

export interface GenericTemplateData {
  subject: string;
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  link?: string;
  reportLink?: string;
  solveLink?: string;
  requestMoreHelpLink?: string;
  deleteLink?: string;
}

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
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  link: string;
  reportLink: string;
}

export interface OffersWithoutAnswersTemplateData {
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  requestMoreHelpLink: string;
  deleteLink: string;
}

export interface OffersWithAnswersTemplateData {
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  solveLink: string;
  requestMoreHelpLink: string;
  deleteLink: string;
}

export interface OfferHelpTemplateData {
  answer: string;
  email: string;
  request: AskForHelpCollectionEntry['d']['request'];
  askForHelpLink: string;
}

export interface AskForHelpTemplateData {
  request: AskForHelpCollectionEntry['d']['request'];
  location: AskForHelpCollectionEntry['d']['location'];
  link: string;
  reportLink: string;
}
