import { Change, database } from 'firebase-functions';
import * as admin from 'firebase-admin';

export async function onContentUpdate(change: Change<database.DataSnapshot>) {
    const oldContent = change.before;
    await admin.database().ref(`/cmsBackup_${Date.now()}/`).set(oldContent.val());
}