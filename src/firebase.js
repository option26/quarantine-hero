import * as app from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import config from './firebaseConfig';

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.app = app;
    this.auth = app.auth();
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
}
export default new Firebase();
