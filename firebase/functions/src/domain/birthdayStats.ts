import * as admin from 'firebase-admin';

import { CollectionName } from '../types/enum/CollectionName';

export async function birthdayStats(): Promise<void> {
    try {
        const sinceTimestamp = Date.parse('Tue Mar 09 2021 21:00:00 GMT+0100');
        const db = admin.firestore();

        const notifications = await db.collection(CollectionName.Notifications)
            .where('d.timestamp', '>=', sinceTimestamp)
            .get();

        const solvedPosts = await db.collection(CollectionName.SolvedPosts)
            .where('d.timestamp', '>=', sinceTimestamp)
            .get();

        const users = await db.collection(CollectionName.Users)
            .where('timestamp', '>=', sinceTimestamp)
            .get();

        const offerHelp = await db.collectionGroup(CollectionName.OfferHelp)
            .where('timestamp', '>=', sinceTimestamp)
            .get();

        await db.collection(CollectionName.BirthdayStats).doc('external').set({
            offerHelp: offerHelp.size,
            notifications: notifications.size,
            solvedPosts: solvedPosts.size,
            users: users.size,
        });
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
}
