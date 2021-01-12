import {
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '../../config';

import { sendEmailToUser } from './sendEmailToUser';

import { AskForHelpCollectionEntry } from '../../types/interface/collections/AskForHelpCollectionEntry';
import { SendgridTemplateData } from '../../types/interface/email/SendgridTemplateData';
import { SendgridTemplateId } from '../../types/enum/SendgridTemplateId';

export async function sendEmailForAskForHelpEntries(askForHelpEntries: FirebaseFirestore.DocumentData[], templateId: SendgridTemplateId) {
  const asyncEmails = askForHelpEntries.map(async (askForHelpSnap) => {
    const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
    const askForHelpId = askForHelpSnap.id;
    // eslint-disable-next-line no-console
    console.log('askForHelpId', askForHelpId);
    // eslint-disable-next-line no-console
    if (SEND_EMAILS) {
      const templateData = getTemplateDateForEntry(templateId, askForHelpId, askForHelpSnapData);
      await sendEmailToUser(askForHelpSnapData.d.uid, templateId, templateData);
      return askForHelpSnapData.d.uid;
    }
    // eslint-disable-next-line no-console
    console.log(sendingMailsDisabledLogMessage);
    return null;
  });
  const result = await Promise.all(asyncEmails);
  console.log('result', result);
}

function getTemplateDateForEntry(templateId: SendgridTemplateId, askForHelpId: string, askForHelpSnapData: AskForHelpCollectionEntry): SendgridTemplateData {
  switch (templateId) {
    case SendgridTemplateId.DoYouStillNeedHelp:
      return {
        subject: 'QuarantäneHeld*innen - Benötigst du weiterhin Hilfe?',
        request: askForHelpSnapData.d.request,
        location: askForHelpSnapData.d.location,
        link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
        requestMoreHelpLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&moreHelp=true`,
        deleteLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&delete=true`,
      };
    case SendgridTemplateId.HaveYouReceivedHelp:
      return {
        subject: 'QuarantäneHeld*innen - Wurde Dir geholfen?',
        request: askForHelpSnapData.d.request,
        location: askForHelpSnapData.d.location,
        link: `https://www.quarantaenehelden.org/#/offer-help/${askForHelpId}`,
        solveLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&solve=true`,
        requestMoreHelpLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&moreHelp=true`,
        deleteLink: `https://www.quarantaenehelden.org/#/offer-help/?entry=${askForHelpId}&delete=true`,
      };
  }
}
