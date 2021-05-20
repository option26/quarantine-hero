import * as admin from 'firebase-admin';
import { askForMoreHelp } from './handleAskForMoreHelp';
import { answerDirectly } from '../utilities/slack';
import { CollectionName } from '../types/enum/CollectionName';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';

export async function onIncreaseReach(messageRef: string, actions: Array<{ value: string }>, responseUrl: string) {
    const db = admin.firestore();
    const { value } = actions[0];
    const allowed = value === 'true';

    if (!allowed) {
        await answerDirectly('Die Reichweite wurde nicht erhöht', responseUrl);
        return;
    }

    try {
        const snapshot = await db.collection(CollectionName.AskForHelp).where('d.slackMessageRef', '==', messageRef).get();


        if (snapshot.empty) {
            throw new Error('Keine Nachrichten mit dieser Slack-Referenz');
        }

        if (snapshot.docs.length > 1) {
            throw new Error('Mehr als eine Nachricht mit dieser Slack-Referenz');
        }

        // Get the identified post
        const askForHelpSnap = snapshot.docs[0];
        const askForHelpData = askForHelpSnap.data() as AskForHelpCollectionEntry;

        await askForMoreHelp(askForHelpSnap.id, askForHelpData.d.uid);

        await answerDirectly('Reichweite wurde erhöht.', responseUrl);
    } catch (err) {
        await answerDirectly(`Fehler beim Erhöhen der Reichweite des Posts: ${err}`, responseUrl);
    }
}
