import { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';

export default function useFirebaseDownload(url) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLink = async () => {
      try {
        const l = await firebase.storage().refFromURL(url).getDownloadURL();
        setLink(l);
      } catch (err) {
        setError(err);
      }
    };

    getLink();
  }, [url]);

  return [link, error];
}
