import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';

export default function NotifyMe({ location, placeId }) {
  const { t } = useTranslation();

  return (
    <div className="py-3 w-full">
      <div className="my-3 w-full">
        <Link
          to={location && placeId ? `/notify-me?location=${location}&placeId=${placeId}` : '/notify-me'}
          className="btn-green-secondary my-3 w-full block"
          onClick={() => fb.analytics.logEvent('button_subscribe_region')}
        >
          {location && placeId
            ? t('components.filteredList.notifyMeForLocation', { location })
            : t('components.filteredList.notifyMeFallback')}
        </Link>
      </div>
    </div>
  );
}
