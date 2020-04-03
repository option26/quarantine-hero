import React from 'react';
import { useTranslation } from 'react-i18next';
import EntryContainer from '../components/EntryContainer';
import Footer from '../components/Footer';
import OnePagers from '../components/OnePagers';

export default function Overview() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="py-4 pt-10 font-teaser">{t('views.overview.title')}</h1>
      <div className="font-open-sans">
        {t('views.overview.enterYourPostalCode')}
      </div>
      <OnePagers />
      <div className="h-3 w-full" />
      <div className="py-3">
        <EntryContainer pageSize={20} />
      </div>
      <Footer />
    </div>
  );
}
