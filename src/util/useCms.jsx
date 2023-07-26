import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import * as Sentry from '@sentry/browser';
import i18next from 'i18next';

export default function useCms(collectionName) {
  const [content, setContent] = useState([]);
  const { languages } = i18next;

  useEffect(() => {
    const getContent = async (collName, lang) => (
      new Promise((resolve, reject) => {
        const contentRef = firebase.database().ref(`cmsContent/${collName}/${lang}`);

        contentRef.once('value', (snapshot) => {
          if (!snapshot.exists()) {
            return reject(new Error(`No content for lang ${lang} in ${collName}`));
          }
          return resolve(contentRef);
        });
      })
    );

    const getInternationalizedContent = async () => {
      for (let i = 0; i < languages.length; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const contentRef = await getContent(collectionName, languages[i]);
          contentRef.on('value', (snapshot) => setContent(snapshot.val()));
          return;
        } catch (err) {
          // We did not find any content for all tested languages
          if (i === languages.length - 1) {
            Sentry.captureException(new Error(`Ultimately failed to get content: ${err.message}`));
          }
        }
      }
    };

    if (languages) {
      getInternationalizedContent();
    }
  }, [collectionName, languages]);

  return [content];
}
