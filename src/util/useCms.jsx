import { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import i18next from 'i18next';

export default function useCms(collectionName) {
  const [content, setContent] = useState([]);
  const { languages } = i18next;

  useEffect(() => {
    const getContent = async (collName, lang) => (
      new Promise((resolve, reject) => {
        const contentRef = firebase.database().ref(`${collName}/${lang}`);

        contentRef.once('value', (snapshot) => {
          if (snapshot.val() === null) {
            return reject(new Error('Undefined key'));
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
        } catch (err) { } // eslint-disable-line no-empty
      }
    };

    getInternationalizedContent();
  }, [collectionName, languages]);

  return [content];
}
