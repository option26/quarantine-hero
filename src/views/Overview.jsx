import React from 'react';
import { useTranslation } from 'react-i18next';
import FilteredList from '../components/FilteredList';
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
      <div className="py-3">
        <FilteredList pageSize={20} />
      </div>
      <Footer />
    </div>
  );
}
