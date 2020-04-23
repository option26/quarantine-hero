import * as app from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';

class Firebase {
  constructor() {
    app.initializeApp({
      apiKey: 'AIzaSyDqLWU3E81aqTqEvps7yc_bQOfPOZQzGEE',
      authDomain: 'qhero-stage.firebaseapp.com',
      databaseURL: 'https://qhero-stage.firebaseio.com',
      projectId: 'qhero-stage',
      storageBucket: 'qhero-stage.appspot.com',
      messagingSenderId: '855597135666',
      appId: '1:855597135666:web:9bf52744911dd9d252c92b',
      measurementId: 'G-MM2TK770SV',
    });
    this.app = app;
    this.auth = app.auth();
    this.analytics = {
      logEvent: () => {},
    };
    this.store = app.firestore();
  }
}
export default new Firebase();
