import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { REGION_EUROPE_WEST_1 } from '@config';

import { handleIncomingCall as handleIncomingCallFromHotline } from './domain/handleIncomingCall';
import { onAskForHelpCreate } from './domain/onAskForHelpCreate';
import { onAskForHelpUpdate } from './domain/onAskForHelpUpdate';
import { onDeletedCreate } from './domain/onDeletedCreate';
import { onUserDelete } from './domain/onUserDelete';
import { onOfferHelpCreate } from './domain/onOfferHelpCreate';
import { onReportedPostsCreate } from './domain/onReportedPostsCreate';
import { onSolvedPostsCreate } from './domain/onSolvedPostsCreate';
import { onSubscribeToBeNotifiedCreate } from './domain/onSubscribeToBeNotifiedCreate';
import { searchAndSendNotificationEmails } from './domain/searchAndSendNotificationEmails';
import { sendEmailsForOpenOffersWithAnswers } from './domain/sendEmailsForOpenOffersWithAnswers';
import { sendEmailsForOpenOffersWithoutAnswers } from './domain/sendEmailsForOpenOffersWithoutAnswers';

import { CollectionName } from '@enum/CollectionName';

admin.initializeApp();

export const sendNotificationEmails = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-23 * * *') // At every 3rd minute past every hour from 9 through 23.
  .timeZone('Europe/Berlin')
  .onRun(searchAndSendNotificationEmails);

export const sendNotificationEmailsForOpenOffersWithoutAnswers = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-23 * * *') // At every 3rd minute past every hour from 9 through 23.
  .timeZone('Europe/Berlin')
  .onRun(sendEmailsForOpenOffersWithoutAnswers);

export const sendNotificationEmailsForOpenOffersWithAnswers = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-23 * * *') // At every 3rd minute past every hour from 9 through 23.
  .timeZone('Europe/Berlin')
  .onRun(sendEmailsForOpenOffersWithAnswers);


export const askForHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.AskForHelp}/{requestId}`)
  .onCreate(onAskForHelpCreate);

  export const askForHelpUpdate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.AskForHelp}/{requestId}`)
  .onUpdate(onAskForHelpUpdate);

export const regionSubscribeCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.Notifications}/{helperId}`)
  .onCreate(onSubscribeToBeNotifiedCreate);

export const reportedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.ReportedPosts}/{reportRequestId}`)
  .onCreate(onReportedPostsCreate);

export const solvedPostsCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.SolvedPosts}/{reportRequestId}`)
  .onCreate(onSolvedPostsCreate);

export const deletedCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.Deleted}/{reportRequestId}`)
  .onCreate(onDeletedCreate);

export const offerHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.AskForHelp}/{requestId}/offer-help/{offerId}`)
  .onCreate(onOfferHelpCreate);

export const handleIncomingCall = functions
  .region(REGION_EUROPE_WEST_1)
  .https
  .onRequest(handleIncomingCallFromHotline);

export const deleteUserData = functions
  .region(REGION_EUROPE_WEST_1)
  .auth
  .user()
  .onDelete(onUserDelete);
