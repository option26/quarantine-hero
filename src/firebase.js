import * as app from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import config from './firebaseConfig.js'

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.app = app;
    this.auth = app.auth();
    this.analytics = {
      logEvent: () => {}
    };
    this.store = app.firestore();
  }
}
export default new Firebase();
