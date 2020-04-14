import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useTranslation } from 'react-i18next';
import fb from '../firebase';
import Entry from '../components/entry/Entry';

const askForHelpCollection = fb.store.collection('ask-for-help');
const offerHelpCollection = fb.store.collection('offer-help');

function Notification(props) {
  const { t } = useTranslation();

  const onDeleteClick = () => {
    offerHelpCollection.doc(props.id).delete();
  };

  return (
    <div>
      <div className="shadow rounded border mb-4 px-4 py-2 flex justify-between">
        {t('views.dashboard.youWillBeNotified')}
        {' '}
        {props.location}
        {' '}
        {t('views.dashboard.needsHelp')}
        <button type="button" className="cursor-pointer font-bold" onClick={onDeleteClick}>
          &times;
        </button>
      </div>
    </div>
  );
}

// Commented out until there is a consistent way of showing placeholders on the site
// function DashboardLoading() {
//   const { t } = useTranslation();
//   return <div className="font-open-sans my-8 text-lg text-center">{t('views.dashboard.isLoading')}</div>;
// }

function Dashboard(props) {
  const { user } = props;

  const { t } = useTranslation();

  const [requestsForHelpUnsorted, isLoadingRequestsForHelp] = useCollectionData(
    askForHelpCollection.where('d.uid', '==', user.uid),
    { idField: 'id' },
  );
  const requestsForHelp = (requestsForHelpUnsorted || [])
    .map((doc) => ({ ...doc.d, id: doc.id }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const [offersDocs, isLoadingOffers] = useCollectionData(
    offerHelpCollection.where('d.uid', '==', user.uid),
    { idField: 'id' },
  );
  const offers = (offersDocs || []).map((val) => ({ ...val.d, id: val.id }));

  if (isLoadingRequestsForHelp || isLoadingOffers) {
    // Commented out until there is a consistent way of showing placeholders on the site
    // return <DashboardLoading />;
  }

  return (
    <div className="p-4">
      <h1 className="font-teaser py-4 pt-10">{t('views.dashboard.yourRequests')}</h1>

      {requestsForHelp.length === 0
        ? (
          <div className="font-open-sans">
            {t('views.dashboard.noRequests')}
            {' '}
            <Link className="text-secondary hover:underline" to="/ask-for-help" onClick={() => fb.analytics.logEvent('button_want_to_help')}>hier</Link>
            {' '}
            {t('views.dashboard.create')}
            .
          </div>
        )
        : requestsForHelp.map((entry) => (<Entry {...entry} key={entry.id} owner />))}

      <h1 className="font-teaser py-4 pt-10">{t('views.dashboard.yourNotifications')}</h1>

      {offers.length === 0
        ? (
          <div className="font-open-sans">
            {t('views.dashboard.noNotificationsSubscribed')}
            {' '}
            <Link className="text-secondary hover:underline" to="/notify-me" onClick={() => fb.analytics.logEvent('button_subscribe_region')}>{t('views.dashboard.here')}</Link>
            {' '}
            {t('views.dashboard.register')}
            .
          </div>
        )
        : offers.map((offer) => <Notification location={offer.location} id={offer.id} key={offer.id} />)}

    </div>
  );
}

export default function DashboardWithAuth() {
  const [user, isAuthLoading] = useAuthState(fb.auth);

  if (isAuthLoading) {
    // Commented out until there is a consistent way of showing placeholders on the site
    // return <DashboardLoading />;
    return null;
  }

  if (!user || !user.email) {
    return <Redirect to="/signin/dashboard" />;
  }

  return <Dashboard user={user} />;
}
