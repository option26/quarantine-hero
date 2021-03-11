import axios from 'axios';
import * as admin from 'firebase-admin';
import getReelShares from '../utilities/instagram';

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

        const reelShares = await getReelShares(sinceTimestamp);

        await db.collection(CollectionName.BirthdayStats).doc('external').set({
            offerHelp: offerHelp.size,
            notifications: notifications.size,
            donations,
            stories: reelShares,
        });
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
}
