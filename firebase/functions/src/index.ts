import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { REGION_EUROPE_WEST_1 } from './config';

import { handleAskForMoreHelp as handleAskForMoreHelpFunction } from './domain/handleAskForMoreHelp';
import { onAskForHelpCreate } from './domain/onAskForHelpCreate';
import { onDeletedCreate } from './domain/onDeletedCreate';
import { onUserDelete } from './domain/onUserDelete';
import { onOfferHelpCreate } from './domain/onOfferHelpCreate';
import { onReportedPostsCreate } from './domain/onReportedPostsCreate';
import { onSolvedPostsCreate } from './domain/onSolvedPostsCreate';
import { onSubscribeToBeNotifiedCreate } from './domain/onSubscribeToBeNotifiedCreate';
import { searchAndSendNotificationEmails } from './domain/searchAndSendNotificationEmails';
import { updateGeoDB } from './domain/geoData';
import { onContentUpdate } from './domain/onContentUpdate';
import { sendEmails } from './domain/sendEmails';
import { onSlackInteraction } from './utilities/slack';

import { CollectionName } from './types/enum/CollectionName';

admin.initializeApp();

export const contentUpdated = functions
  .region(REGION_EUROPE_WEST_1)
  .database
  .ref('/cmsContent')
  .onWrite(onContentUpdate);

export const sendNotificationEmails = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/3 9-22 * * *') // At every 3rd minute past every hour from 9 through 22. https://crontab.guru/#*/3_9-22_*_*_*
  .timeZone('Europe/Berlin')
  .onRun(searchAndSendNotificationEmails);

export const askForHelpCreate = functions
  .region(REGION_EUROPE_WEST_1)
  .firestore
  .document(`/${CollectionName.AskForHelp}/{requestId}`)
  .onCreate(onAskForHelpCreate);

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

export const handleAskForMoreHelp = functions
  .region(REGION_EUROPE_WEST_1)
  .https
  .onCall(handleAskForMoreHelpFunction);

export const deleteUserData = functions
  .region(REGION_EUROPE_WEST_1)
  .auth
  .user()
  .onDelete(onUserDelete);

export const updateGeoDBFunction = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('0 0 1 */6 *') // At 1.6 and 1.12 every year https://crontab.guru/#0_0_1_*/6_*
  .timeZone('Europe/Berlin')
  .onRun(updateGeoDB);

export const sendEmailsFunction = functions
  .region(REGION_EUROPE_WEST_1)
  .pubsub
  .schedule('*/5 * * * *') // At every 5th minute https://crontab.guru/#*/5_*_*_*_*
  .timeZone('Europe/Berlin')
  .onRun(sendEmails);

// Handler to handle all incoming slack activities
export const slackInteractivityHandler = functions
  .region('europe-west1')
  .https
  .onRequest(onSlackInteraction);
