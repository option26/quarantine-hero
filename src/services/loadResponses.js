import fb from '../firebase';

export default async function loadResponses(requestForHelpId, collectionName) {
  const request = fb.store.collection(collectionName).doc(requestForHelpId).collection('offer-help').orderBy('timestamp', 'asc');
  const querySnapshot = await request.get();
  return querySnapshot.docs.map((docSnapshot) => ({ ...docSnapshot.data(), id: docSnapshot.id }));
}
