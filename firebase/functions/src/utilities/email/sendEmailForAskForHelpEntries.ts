import * as admin from 'firebase-admin';

import {
  SEND_EMAILS,
  sendingMailsDisabledLogMessage,
} from '../../config';

import { sendEmailToUser } from './sendEmailToUser';

import { AskForHelpCollectionEntry } from '../../types/interface/collections/AskForHelpCollectionEntry';
import {
  OffersWithAnswersTemplateData,
  OffersWithoutAnswersTemplateData,
} from '../../types/interface/email/TemplateData';
import { TemplateId } from '../../types/enum/TemplateId';
import { CollectionName } from '../../types/enum/CollectionName';

export async function sendEmailForAskForHelpEntries(
  askForHelpEntries: FirebaseFirestore.DocumentData[],
  templateId: TemplateId.TemplateForOffersWithAnswers | TemplateId.TemplateForOffersWithoutAnswers
) {
  const asyncEmails = askForHelpEntries.map(async (askForHelpSnap) => {
    const askForHelpSnapData = askForHelpSnap.data() as AskForHelpCollectionEntry;
    const askForHelpId = askForHelpSnap.id;
    // eslint-disable-next-line no-console
    console.log('askForHelpId', askForHelpId);
    // eslint-disable-next-line no-console
    if (SEND_EMAILS) {
      const { data: templateData, subject } = getTemplateDateForEntry(templateId, askForHelpId, askForHelpSnapData);
      await sendEmailToUser(askForHelpSnapData.uid, templateId, templateData, subject);

      const db = admin.firestore();
      const document = db.collection(CollectionName.AskForHelp).doc(askForHelpId);
      const updatedData = {
        'timestampLastEngagementAttempt': Date.now(),
      };
      await document.update(updatedData);

      return askForHelpSnapData.uid;
    }
    // eslint-disable-next-line no-console
    console.log(sendingMailsDisabledLogMessage);
    return null;
  });
  const result = await Promise.all(asyncEmails);
  console.log('result', result);
}

function getTemplateDateForEntry(
  templateId: TemplateId.TemplateForOffersWithAnswers | TemplateId.TemplateForOffersWithoutAnswers,
  askForHelpId: string,
  askForHelpSnapData: AskForHelpCollectionEntry
): { data: OffersWithoutAnswersTemplateData | OffersWithAnswersTemplateData, subject: string } {
  switch (templateId) {
    case TemplateId.TemplateForOffersWithoutAnswers:
      return {
        subject: 'QuarantäneHeld*innen - Benötigst Du weiterhin Hilfe?',
        data: {
          request: askForHelpSnapData.request,
          location: askForHelpSnapData.location,
          requestMoreHelpLink: `https://www.quarantaenehelden.org/#/dashboard?entry=${askForHelpId}&moreHelp=true`,
          deleteLink: `https://www.quarantaenehelden.org/#/dashboard?entry=${askForHelpId}&delete=true`,
        }
      };
    case TemplateId.TemplateForOffersWithAnswers:
      return {
        subject: 'QuarantäneHeld*innen - Wurde Dir geholfen?',
        data: {
          request: askForHelpSnapData.request,
          location: askForHelpSnapData.location,
          solveLink: `https://www.quarantaenehelden.org/#/dashboard/?entry=${askForHelpId}&solve=true`,
          requestMoreHelpLink: `https://www.quarantaenehelden.org/#/dashboard/?entry=${askForHelpId}&moreHelp=true`,
          deleteLink: `https://www.quarantaenehelden.org/#/dashboard/?entry=${askForHelpId}&delete=true`,
        }
      };
  }
}
