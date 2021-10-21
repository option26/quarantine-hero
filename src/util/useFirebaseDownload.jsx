import { useEffect, useState } from 'react';
import fb from '../firebase';

export default function useFirebaseDownload(url) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLink = async () => {
      try {
        const downloadLink = await fb.storage.refFromURL(url).getDownloadURL();
        setLink(downloadLink);
      } catch (err) {
        setError(err);
      }
    };

    getLink();
  }, [url]);

  return [link, error];
}
