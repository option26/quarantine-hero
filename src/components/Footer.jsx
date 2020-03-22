import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex justify-center text-sm text-gray-700 mb-4 mt-8 w-full">
        <Link to="/faq">{t('components.footer.FAQs')}</Link>
        <div className="mx-1">|</div>
        <Link to="/impressum">{t('components.footer.legal')}</Link>
        <div className="mx-1">|</div>
        <Link to="/dsgvo">{t('components.footer.privacy')}</Link>
      </div>
      <span className="text-gray-500 text-xs block w-full text-center">{t('components.footer.forEveryone')}</span>
    </div>
  );
}
