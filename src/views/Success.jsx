import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import StatusIndicator from '../components/StatusIndicator';

export default function Success() {
  useEffect(() => {
    fb.analytics.logEvent('success_request_help');
  }, []);

  const { t } = useTranslation();

  return <StatusIndicator success text={t('views.success.thankYou')} />;
}
