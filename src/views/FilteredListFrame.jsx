import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { baseUrl } from '../appConfig';
import EntryContainer from '../components/EntryContainer';

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
        if (target && !target.startsWith(baseUrl)) {
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
      <div className="iframe-header w-full relative overflow-hidden">
        <div className="iframe-header-overlay absolute h-full z-10 p-8">
          <img className="iframe-header-logo" src={require('../assets/logo_white.svg')} alt="" />
        </div>
        <div className="h-full flex flex-col items-end justify-between p-4">
          <div className="text-white text-right">
            <Trans i18nKey="views.filteredListFrame.description">
              <strong>
                text
              </strong>
              {' '}
              text
              <br />
              text
              <br />
              text
            </Trans>
          </div>
          <div className="flex z-20 iframe-header-buttons">
            <Link
              to="/overview"
              className="flex justify-center items-center rounded text-white py-3 pl-1 pr-3 btn-main btn-white-shadow bg-secondary flex-1"
            >
              <img className="w-8 mr-1" src={require('../assets/hero.png')} alt="" />
              {t('views.main.buttons.wantToHelp')}
            </Link>
            <div className="mx-1" />
            <Link
              to="/signup/ask-for-help"
              className="flex justify-center items-center rounded text-white py-3 pl-1 px-3 btn-main btn-white-shadow bg-primary flex-1"
            >
              <img className="w-8" src={require('../assets/need_help.png')} alt="" />
              {t('views.main.buttons.needHelp')}
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 mb-4 px-4 md:px-16 w-full">
        <EntryContainer pageSize={20} title="Aktuelle Anfragen durchsuchen" />
      </div>
    </div>
  );
}
