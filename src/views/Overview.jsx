import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import FilteredList from '../components/FilteredList';
import Footer from '../components/Footer';

// @TODO Should not this be named "Overview" since AskForHelp is already name of an other view?
export default function AskForHelp() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="py-4 pt-10 font-teaser">{t('views:overview.title')}</h1>
      <div className="font-open-sans">
        {t('views:overview.enterYourPostalCode')}
      </div>
      <div className="my-4 p-4 flex flex-row justify-start items-center bg-kaki">
        <img className="w-30 h-10 md:h-16 mr-4" src={require('../assets/aushang.svg')} alt="" />
        <p>
          {t('views:overview.noInternet.preBreak')}
          {' '}
          <br className="sm:hidden" />
          <Trans i18nKey="views.overview.noInternet.postBreak">
            text
            <a href="/assets/aushang.pdf" className="text-secondary hover:underline" download="/assets/aushang.pdf">text</a>
            text
          </Trans>
        </p>
      </div>
      <div className="py-3">
        <FilteredList pageSize={20} />
      </div>
      <Footer />
    </div>
  );
}
