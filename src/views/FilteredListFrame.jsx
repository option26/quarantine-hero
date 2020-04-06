import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EntryContainer from '../components/EntryContainer';
import { baseUrl } from '../appConfig';


export default function FilteredListView() {
  const { t } = useTranslation();

  useEffect(() => {
    const makeExternalLinks = () => {
      const anchors = document.getElementsByTagName('a');
      for (let i = 0; i < anchors.length; i += 1) {
        anchors[i].target = '_blank';
        anchors[i].setAttribute('rel', 'noopener noreferrer');
        anchors[i].onclick = (e) => e.stopPropagation();
        const target = anchors[i].getAttribute('href');
        if (!target.startsWith(baseUrl)) {
          anchors[i].setAttribute('href', `${baseUrl}/${target}`);
        }
      }
    };

    const mutationObserver = new MutationObserver(makeExternalLinks);

    makeExternalLinks();

    mutationObserver.observe(document, { attributes: false, childList: true, subtree: true });

    return () => mutationObserver.disconnect();
  }, []);

  return (
    <div className="flex items-center flex-col">
      <div className="phone-width">
        <div className="flex text-center font-teaser justify-center w-full my-8 md:my-10">
          {t('views.main.weAreHumans')}
          <br />
          {t('views.main.inTimesOfNeed')}
          <br />
          {t('views.main.bePart')}
          <br />
        </div>
        <div className="flex justify-around px-2 md:px-4 my-6 md:my-10 w-full">
          <Link
            to="/overview"
            className="flex justify-center items-center rounded text-white py-3 pl-1 pr-3 btn-main bg-secondary flex-1 hover:opacity-75"
          >
            <img className="w-8 mr-1" src={require('../assets/hero.png')} alt="" />
            {t('views.main.buttons.wantToHelp')}
          </Link>
          <div className="mx-1 md:mx-4" />
          <Link
            to="/signup/ask-for-help"
            className="flex justify-center items-center rounded text-white py-3 pl-1 px-3 btn-main bg-primary flex-1 hover:opacity-75"
          >
            <img className="w-8" src={require('../assets/need_help.png')} alt="" />
            {t('views.main.buttons.needHelp')}
          </Link>
        </div>
      </div>
      <div className="mt-2 mb-4 px-2 md:px-4 w-full">
        <EntryContainer pageSize={20} />
      </div>
    </div>
  );
}
