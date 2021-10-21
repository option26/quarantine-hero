import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import config from './firebaseConfig';

const firebaseApp = firebase.initializeApp(config);
const auth = firebaseApp.auth();
const firestore = firebaseApp.firestore();
const realtimeDB = firebaseApp.database();
const storage = firebaseApp.storage();
const functions = firebaseApp.functions('europe-west1');

function askForMoreHelp(askForHelpId) {
  const handleAskForMoreHelp = functions.httpsCallable('handleAskForMoreHelp', {});
  return handleAskForMoreHelp(askForHelpId);
}

const mockAnalytics = {
  logEvent: () => {},
};
// eslint-disable-next-line import/no-mutable-exports
let analytics = mockAnalytics;

function setAnalytics(enabled) {
  analytics = enabled ? firebaseApp.analytics() : mockAnalytics;
}

export default {
  app: firebaseApp,
  auth,
  analytics,
  store: firestore,
  storage,
  realtimeDB,
  setAnalytics,
  askForMoreHelp,
};
