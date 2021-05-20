import * as admin from 'firebase-admin';
import { askForMoreHelp } from './handleAskForMoreHelp';
import { answerDirectly } from '../utilities/slack';
import { CollectionName } from '../types/enum/CollectionName';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';

export async function onIncreaseReach(actions: Array<{ value: string }>, responseUrl: string) {
    const db = admin.firestore();
    const { value } = actions[0];
    const [response, askForHelpId] = value.split('|');
    const allowed = response === 'true';

    if (!allowed) {
        await answerDirectly('Die Reichweite wurde nicht erhöht', responseUrl);
        return;
    }

    try {
        const askForHelpSnap = await db.collection(CollectionName.AskForHelp).doc(askForHelpId).get();

        if (askForHelpSnap.exists) {
            throw new Error('Keine Inserat mit dieser ID');
        }

        // Get the identified post
        const askForHelpData = askForHelpSnap.data() as AskForHelpCollectionEntry;

        await askForMoreHelp(askForHelpSnap.id, askForHelpData.d.uid);

        await answerDirectly('Reichweite wurde erhöht.', responseUrl);
    } catch (err) {
        await answerDirectly(`Fehler beim Erhöhen der Reichweite des Posts: ${err}`, responseUrl);
    }
}
