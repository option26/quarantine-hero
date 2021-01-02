import { GeoFirestore } from 'geofirestore';
import fb from '../firebase';
import { getLatLng } from './GeoService';
import parseDoc from '../util/parseDoc';

const askForHelpCollection = fb.store.collection('ask-for-help');
const solvedPostsCollection = fb.store.collection('solved-posts');
const geoCollectionAskForHelp = new GeoFirestore(fb.store).collection('ask-for-help');

// we cannot use destructuring syntax here because it will break the firebase document entries
function markSolved(document) {
  document.solved = true; // eslint-disable-line no-param-reassign
  return document;
}

export async function getInitialDocuments(pageSize = 20) {
  const askForHelpQuery = askForHelpCollection.orderBy('d.timestamp', 'desc').limit(pageSize);
  const solvedPostsQuery = solvedPostsCollection.orderBy('d.timestamp', 'desc').limit(pageSize);

  const askForHelpDocuments = await askForHelpQuery.get().then((snap) => snap.docs.map(parseDoc).filter(Boolean));
  const solvedPostsDocuments = await solvedPostsQuery.get().then((snap) => snap.docs.map(markSolved).map(parseDoc).filter(Boolean));

  const oldestAskForHelpTimestamp = Math.min(...askForHelpDocuments.map((d) => d.timestamp));
  const youngerSolvedPostsDocuments = solvedPostsDocuments.filter((d) => d.timestamp >= oldestAskForHelpTimestamp);

  const combinedDocs = [...askForHelpDocuments, ...youngerSolvedPostsDocuments];
  // Client-side sorting necessary
  combinedDocs.sort((doc1, doc2) => doc2.timestamp - doc1.timestamp);

  return combinedDocs;
}

export async function loadMoreDocuments(startAfter, pageSize = 20) {
  const query = askForHelpCollection.orderBy('d.timestamp', 'desc').startAfter(startAfter).limit(pageSize);

  const snapshot = await query.get();
  // Filter broken documents
  const documents = snapshot.docs.map(parseDoc).filter(Boolean);

  return documents;
}

export async function searchDocuments(geoData, radius) {
  const { lat, lng } = getLatLng(geoData);

  const query = geoCollectionAskForHelp.near({
    center: new fb.app.firestore.GeoPoint(lat, lng),
    radius,
  });

  const documents = await query.get().then((snap) => snap.docs.map(parseDoc).filter(Boolean));

  // Client-side sorting necessary for geoqueries
  documents.sort((doc1, doc2) => doc2.timestamp - doc1.timestamp);

  return documents;
}
