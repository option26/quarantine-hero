import axios from 'axios';
import * as admin from 'firebase-admin';

import { CollectionName } from '../types/enum/CollectionName';

export async function birthdayStats(): Promise<void> {
    try {
        const sinceTimestamp = Date.parse('2021-03-14T00:00:00+01:00');
        const db = admin.firestore();

        const notifications = await db.collection(CollectionName.Notifications)
            .where('d.timestamp', '>=', sinceTimestamp)
            .get();

        const offerHelp = await db.collectionGroup(CollectionName.OfferHelp)
            .where('timestamp', '>=', sinceTimestamp)
            .get();

        const { data: betterPlaceResponse } = await axios.get('https://api.betterplace.org/de/api_v4/fundraising_events/37416.json');
        const donations = Math.round((betterPlaceResponse?.donated_amount_in_cents || 0) / 100);

        const docRef = db.collection(CollectionName.BirthdayStats).doc('external');
        try {
            await docRef.update({
                offerHelp: offerHelp.size,
                notifications: notifications.size,
                donations,
            });
        } catch (err) {
            await docRef.set({
                offerHelp: offerHelp.size,
                notifications: notifications.size,
                donations,
                stories: 0
            });
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
}
