import * as Sentry from '@sentry/browser';
import { useTranslation } from 'react-i18next';
import Loader from '../components/loader/Loader';
import useCms from '../util/useCms';
import useFirebaseDownload from '../util/useFirebaseDownload';
import { ClipboardIcon } from '../util/Icons';
import ZDFImage from '../assets/zdf.jpg';
import SZImage from '../assets/sueddeutsche_zeitung.jpg';
import Sat1Image from '../assets/sat1.jpg';
import BerlinerMorgenpostImage from '../assets/berliner_morgenpost.jpg';
import DLFImage from '../assets/deutschlandfunk.jpg';
import WDRImage from '../assets/wdr.jpg';
import HRImage from '../assets/hr.jpg';
import BRImage from '../assets/br.jpg';
import WeltImage from '../assets/welt.jpg';
import FocusImage from '../assets/focus_online.jpg';
import GreenPeaceImage from '../assets/greenpeace_magazin.jpg';
import AktionMenschImage from '../assets/aktion_mensch.jpg';
import UtopiaImage from '../assets/utopia.jpg';
import VogueImage from '../assets/vogue.jpg';
import CosmoImage from '../assets/cosmopolitan.jpg';
import BunteImage from '../assets/bunte_de.jpg';

export default function Press() {
  const [presseLink, errorGeneratingPressLink] = useFirebaseDownload('gs://quarantine-hero-assets/MarketingKit.zip');
  const [articles] = useCms('press');
  const { t } = useTranslation();

  if (errorGeneratingPressLink) {
    Sentry.captureException(errorGeneratingPressLink);
  }

  const Article = ({ date, title, link, text }) => (
    <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full">
      <div className="text-xs text-gray-700">{date}</div>
      <div className="font-bold">{title}</div>
      {link
        ? (
          <a
            className="text-secondary w-full block truncate"
            href={link}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {link}
          </a>
        ) : (
          <span className="w-full block truncate">{text}</span>
        )}
    </div>
  );

  return (
    <div>
      <div className="mt-4 p-4">
        <div className="font-teaser">
          {t('views.press.newsAndPressKit')}
        </div>
        <div className="font-open-sans mt-4">
          {t('views.press.manyMediaOutletsReported')}
        </div>
        <div className="bg-kaki p-4 mb-10 mt-8 font-open-sans flex">
          <div>
            <img src={ClipboardIcon} alt="Clipboard" className="w-12 mr-4" />
          </div>
          <div>
            <div className="font-bold">
              {t('views.press.pressInformation')}
            </div>
            {t('views.press.pressKit')}
            <br className="sm:hidden" />
            {' '}
            <a
              href={presseLink}
              className="text-secondary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('views.press.pressKitFileName')}
            </a>
            <div>
              {t('views.press.pressContact')}
              <br className="sm:hidden" />
              {' '}
              <a href={`mailto:${t('views.press.pressMail')}`} className="text-secondary hover:underline">{t('views.press.pressMail')}</a>
            </div>
          </div>
        </div>
        <div className="my-8 flex flex-wrap mb-16">
          <div className="w-1/4 h-auto">
            <img alt="zdf" src={ZDFImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="sueddeutsche_zeitung" src={SZImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="sat1" src={Sat1Image} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="berliner_morgenpost" src={BerlinerMorgenpostImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="deutschlandfunk" src={DLFImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="wdr" src={WDRImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="hr" src={HRImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="br" src={BRImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="welt" src={WeltImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="focus_online" src={FocusImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="greenpeace_magazin" src={GreenPeaceImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="aktion_mensch" src={AktionMenschImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="utopia" src={UtopiaImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="vogue" src={VogueImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="cosmopolitan" src={CosmoImage} />
          </div>
          <div className="w-1/4 h-auto">
            <img alt="bunte_de" src={BunteImage} />
          </div>
        </div>
        <Loader waitOn={articles.length > 0}>
          {articles.map((article) => (
            <Article
              key={article.link || article.text}
              date={article.date}
              title={article.title}
              link={article.link}
              text={article.text}
            />
          ))}
        </Loader>
        <div className="bg-kaki p-4 mb-4 mt-4 font-open-sans w-full text-center">
          <div className="font-bold">{t('views.press.andManyMore')}</div>
        </div>
      </div>
    </div>
  );
}
