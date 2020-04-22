import { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';

export default function useFirebaseDownload(url) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    firebase.storage()
      .refFromURL(url)
      .getDownloadURL()
      .then((l) => setLink(l))
      .catch((err) => setError(err));
  }, [url]);

  return [link, error];
}
