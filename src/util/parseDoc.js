import * as Sentry from '@sentry/browser';

export default function parseDoc(doc) {
  try {
    const data = doc.data();
    return { ...(data.d || data), id: doc.id };
  } catch (err) {
    Sentry.captureException(new Error(`Error parsing ask-for-help ${doc.id}`));
    return null;
  }
}
