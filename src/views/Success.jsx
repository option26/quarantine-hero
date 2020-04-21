import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';

export default function Success() {
  useEffect(() => {
    fb.analytics.logEvent('success_request_help');
  }, []);

  const { t } = useTranslation();

  return (
    <div>
      <div className="mt-8 p-1">
        <p className="text-2xl font-teaser mb-8 text-center">{t('views.success.thankYou')}</p>
        <div className="flex justify-center flex-col items-center mb-8">
          <img className="h-48 w-48 my-10" src={require('../assets/success.svg')} alt="" />
          <Link className="btn-green mt-10" data-cy="success-link-to-dashboard" to="/dashboard">{t('views.success.toDashboard')}</Link>
        </div>
      </div>
    </div>
  );
}
