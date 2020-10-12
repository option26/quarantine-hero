import * as admin from 'firebase-admin';

import { ReportedPostsCollectionEntry } from '../types/interface/collections/ReportedPostsCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { AskForHelpCollectionEntry } from 'src/types/interface/collections/AskForHelpCollectionEntry';
import { postReplyToSlack } from 'src/utilities/slack';

export async function onReportedPostsCreate(snap: admin.firestore.DocumentSnapshot): Promise<void> {
  try {
    const db = admin.firestore();
    const snapValue = snap.data() as ReportedPostsCollectionEntry;
    const { askForHelpId, uid } = snapValue;

    try {
      //Don't break whole function only because of slack
      const slackMessageRef = await db
        .collection(CollectionName.AskForHelp)
        .doc(askForHelpId)
        .get()
        .then(snapshot => {
          return (snapshot.data() as AskForHelpCollectionEntry | undefined)?.d.slackMessageRef;
        });
        await postReplyToSlack(slackMessageRef, 'Diese Anfrage wurde gemeldet', true);
    } catch (err) {
      console.log('Error posting to slack', err);
    }

    // https://cloud.google.com/firestore/docs/manage-data/add-data#update_elements_in_an_array
    await db.collection(CollectionName.AskForHelp).doc(askForHelpId).update({
      'd.reportedBy': admin.firestore.FieldValue.arrayUnion(uid),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('ID', snap.id);
  }
}
