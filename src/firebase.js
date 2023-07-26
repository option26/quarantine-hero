import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import config from './firebaseConfig';

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.app = app;
    this.auth = app.auth();
    this.functions = app.app().functions('europe-west1'); // FIXME: Check what .app() actually is
    this.setAnalytics(false);
    this.store = app.firestore();
  }

  setAnalytics(state) {
    if (state) {
      this.analytics = app.analytics();
      return;
    }
    this.analytics = {
      logEvent: () => { },
    };
  }

  askForMoreHelp(askForHelpId) {
    const handleAskForMoreHelp = this.functions.httpsCallable('handleAskForMoreHelp', { });
    return handleAskForMoreHelp(askForHelpId);
  }
}
export default new Firebase();
