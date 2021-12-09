import React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Rule title={t('views.main.importantNotes.cautious.title')} icon={require('../assets/dont_help.svg')}>
        <p className="hyphens-auto">{t('views.main.importantNotes.cautious.text')}</p>
      </Rule>

      <Rule title={t('views.main.importantNotes.distanced.title')} icon={require('../assets/distanziert.svg')}>
        <p className="hyphens-auto">{t('views.main.importantNotes.distanced.text')}</p>
      </Rule>
    </div>
  );
};

const Rule = ({ icon, title, children }) => (
  <div className="mt-5 md:mt-2 md:px-2 flex flex-row md:flex-col md:text-center items-center">
    <img className="w-12 h-12 m-6 md:mb-2 flex-shrink-0" src={icon} alt="" />
    <div>
      <h3 className="font-exo2 text-lg font-semibold">{title}</h3>
      <p className="font-open-sans max-w-xl">
        {children}
      </p>
    </div>
  </div>
);
