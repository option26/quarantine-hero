const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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',
);

exports.firestoreRequest = functions.region('europe-west1').firestore.document('/ask-for-help/{requestId}/offerHelp')
  .onCreate((snap, context) => {

    const requestId = snap.id; // get the id
    const db = admin.firestore();

    return db.collection(`/ask-for-help`).doc(requestId)
      .get()
      .then(doc => {
        const { request, email } = doc.data();
        const text = `<div>
      <h4>Information</h4>
      <ul>
        <li>
          Email - ${email || ''}
        </li>
      </ul>
      <h4>Message</h4>
      <p>${request || ''}</p>
    </div>`;
        const msg = {
          to: 'ardobras@googlemail.com',
          from: 'no-reply@myemail.com',
          subject: `QuarantäneHelden - Jemand hat dir geschrieben!`,
          text: text,
          html: text,
        };

        sgMail.send(msg);
      });
  });
