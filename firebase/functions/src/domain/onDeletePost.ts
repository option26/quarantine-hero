import * as admin from 'firebase-admin';
import { AskForHelpCollectionEntry } from 'src/types/interface/collections/AskForHelpCollectionEntry';
import { CollectionName } from '../types/enum/CollectionName';
import { answerDirectly, postReplyToSlack } from '../utilities/slack';

export async function onDeletePost(messageRef: string, responseUrl: string) {
    const db = admin.firestore();
    const auth = admin.auth();

    try {
        const snapshot = await db.collection(CollectionName.AskForHelp).where('slackMessageRef', '==', messageRef).get();
        
        if(snapshot.empty) {
            throw new Error('Keine Nachrichten mit dieser Slack-Referenz');
        }

        if(snapshot.docs.length > 1) {
            throw new Error('Mehr als eine Nachricht mit dieser Slack-Referenz');
        }

        // Get the identified post
        const doc = snapshot.docs[0];
        const data: AskForHelpCollectionEntry = doc.data() as AskForHelpCollectionEntry;

        await db.collection(CollectionName.Deleted).doc(doc.id).set({
          collectionName: CollectionName.AskForHelp, ...doc.data(),
        });

        await postReplyToSlack(messageRef, 'Dieser Post wurde manuell gelöscht.', true);

        const user = await auth.getUser(data.uid);
        await answerDirectly(`Post wurde erfolgreich gelöscht. Jetzt Ersteller*in unter ${user.email} benachrichtigen.`, responseUrl);
    } catch (err) {
        await answerDirectly(`Fehler beim Löschen des Posts: ${err}`, responseUrl);
    }
}
