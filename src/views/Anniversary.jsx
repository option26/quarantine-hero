import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase/app';
import useWebSocket from 'react-use-websocket';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import getDateFnsLocaleObject from '../util/getDateFnsLocaleObject';
import createEventListener from '../util/createEventListener';

const socketUrl = 'wss://broadcaster.walls.io/socket.io/?wallId=113374&client=wallsio-frontend&initialCheckins=5&network=&EIO=4&transport=websocket';
const notificationMultiplier = 5;
const storyMultiplier = 2;

function Anniversary() {
  const [stats] = useDocumentData(firebase.firestore().doc('birthday-stats/external'));
  const moneyStats = useMemo(() => {
    const { notifications: notificationCounter, stories: storiesCounter, donations } = stats || {};
    const notificationsMoney = (notificationCounter || 0) * notificationMultiplier;
    const storiesMoney = (storiesCounter || 0) * storyMultiplier;
    const donationsMoney = (donations || 0);

    return {
      notifications: notificationsMoney,
      stories: storiesMoney,
      donations: donationsMoney,
      sum: notificationsMoney + storiesMoney + donationsMoney,
    };
  }, [stats]);
  const { notifications, stories, donations, sum } = moneyStats;

  const { sendMessage, lastMessage } = useWebSocket(socketUrl);
  const feedRef = useRef(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    // Init wall
    if (lastMessage && lastMessage.data && lastMessage.data.startsWith('0')) {
      sendMessage('40');
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!lastMessage || !lastMessage.data || !lastMessage.data.startsWith('42')) {
      return;
    }

    const [opCode, posts] = JSON.parse(lastMessage.data.substring(2));

    if (opCode !== 'new checkins' && opCode !== 'old checkins') {
      return;
    }

    setInstagramPosts((currentPosts) => [...currentPosts, ...posts]);
    setPostsLoading(false);
  }, [lastMessage]);

  const loadOlderPosts = useCallback((lastPost) => {
    const payload = [
      'request older checkins',
      {
        count: 5,
        network: null,
        olderThan: lastPost.external_created_timestamp,
        ignoreId: lastPost.id,
      },
    ];
    sendMessage(`42${JSON.stringify(payload)}`);
  });

  useEffect(() => createEventListener(feedRef.current, 'scroll', (event) => {
    if (!event.target || postsLoading) {
      return;
    }

    const scrollIndex = Math.round((event.target.scrollLeft / event.target.scrollWidth) * instagramPosts.length);

    // Load more as soon as second last is reached
    if (scrollIndex >= instagramPosts.length - 2) {
      setPostsLoading(true);
      loadOlderPosts(instagramPosts[instagramPosts.length - 1]);
    }
  }), [feedRef, instagramPosts, postsLoading]);

  return (
    <div className="flex mt-8 items-center flex-col">
      <div className="phone-width">
        <p className="font-teaser mx-4">
          QuarantäneHeld*innen&nbsp;
          <span className="inline-block">wird ein Jahr alt</span>
        </p>

        <p className="text-justify mt-4 mx-4 font-open-sans font-thin leading-7">
          QuarantäneHeld*innen feiert Geburtstag!
          <br />
          Seit einem Jahr gibt es nun schon die Plattform QuarantäneHeld*innen - ein paar Tage vor dem ersten Lockdown ging die Seite online und seitdem konnte dank eures Einsatzes schon vielen Menschen geholfen werden. DANKE!
          Das wollen wir diese Woche gemeinsam mit euch feiern. Gleichzeitig möchten wir in diesem Rahmen gerne eine Initiative unterstützen und starten dazu eine Spendenaktion für&nbsp;
          <a href="https://silbernetz.org" className="text-secondary hover:underline inline-block" target="_blank" rel="noopener noreferrer">Silbernetz e.V.</a>
        </p>

        <div className="angled-background mt-12 text-justify">
          <div className="flex justify-center -mt-12 md:-mt-10">
            <div className="z-10 rounded-full shadow-around bg-white w-10 h-10 flex items-center justify-center">
              <img alt="arrow-down" className="mt-1" src={require('../assets/arrow_down.svg')} />
            </div>
          </div>

          <p className="font-exo2 text-2xl mt-10 text-center">So kannst Du spenden</p>

          <div className="flex flex-col font-exo2 px-8 mt-4 mb-8">
            <Link to="/notify-me" className="flex items-center md:justify-center action-button relative">
              <img src={require('../assets/hero_outline.svg')} className="h-12" alt="" />
              <div className="flex flex-col ml-4 text-sm">
                <p className="font-semibold">Als Held*in registrieren</p>
                <p>
                  und wir spenden
                  <span className="rounded bg-secondary text-white ml-2 px-1 font-semibold">
                    {notificationMultiplier}
                    €
                  </span>
                </p>
              </div>

              <div className="flex items-center absolute right-0 top-0 bottom-0 mr-4">
                <img src={require('../assets/arrow-right.svg')} className="h-4 w-4" alt="" />
              </div>
            </Link>
            <a href="https://instagram.com/quarantaenehelden" className="flex items-center md:justify-center action-button mt-4 relative">
              <img src={require('../assets/phone_story.svg')} className="h-12" alt="" />
              <div className="flex flex-col ml-4 text-sm">
                <p className="font-semibold">Eine Story posten</p>
                <p>
                  und wir spenden
                  <span className="rounded bg-secondary text-white ml-2 px-1 font-semibold">
                    {storyMultiplier}
                    €
                  </span>
                </p>
              </div>

              <div className="flex items-center absolute right-0 top-0 bottom-0 mr-4">
                <img src={require('../assets/arrow-right.svg')} className="h-4 w-4" alt="" />
              </div>
            </a>
            <a href="https://betterplace.org/de/fundraising-events/24938" className="flex items-center md:justify-center action-button mt-4 relative">
              <img src={require('../assets/donate.svg')} className="h-12" alt="" />
              <div className="flex flex-col ml-4 text-sm">
                <p className="font-semibold">Selbst spenden</p>
                <p>
                  und
                  <span className="rounded bg-secondary text-white mx-2 px-1 font-semibold">
                    ?€
                  </span>
                  beitragen
                </p>
              </div>

              <div className="flex items-center absolute right-0 top-0 bottom-0 mr-4">
                <img src={require('../assets/arrow-right.svg')} className="h-4 w-4" alt="" />
              </div>
            </a>

            <p className="font-exo2 text-2xl mt-10 text-center">
              Bereits gespendet:
              <span className="inline-block rounded bg-secondary text-white ml-4 px-1 font-semibold">
                {sum}
                {' '}
                €
              </span>
            </p>
            <div className="flex justify-between mt-4 mb-4">
              <div className="flex flex-col items-center font-semibold text-center">
                <img src={require('../assets/hero_outline.svg')} className="h-12" alt="" />
                <p>Neue Held*innen</p>
                <p className="text-secondary">
                  {notifications}
                  {' '}
                  €
                </p>
              </div>
              <div className="flex flex-col items-center font-semibold text-center">
                <img src={require('../assets/phone_story.svg')} className="h-12" alt="" />
                <p>Eure Stories</p>
                <p className="text-secondary">
                  {stories}
                  {' '}
                  €
                </p>
              </div>
              <div className="flex flex-col items-center font-semibold text-center">
                <img src={require('../assets/donate.svg')} className="h-12" alt="" />
                <p>Direkte Spenden</p>
                <p className="text-secondary">
                  {donations}
                  {' '}
                  €
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center -mb-12">
            <div className="z-10 rounded-full shadow-around bg-white w-10 h-10 flex items-center justify-center">
              <img alt="arrow-down" className="mt-1" src={require('../assets/arrow_down.svg')} />
            </div>
          </div>
        </div>

        <div className="mt-12 mx-4">
          <p className="font-teaser">Warum Silbernetz</p>
          <p className="text-justify mt-4 font-open-sans font-thin leading-7">
            Im vergangenen Jahr haben wir vor allem über unsere Hotline regelmäßig Kontakt zu älteren Menschen gehabt, die von der Pandemie besonders betroffen sind.
            Viele sind gerade jetzt besonders isoliert und einsam. Um genau diese Menschen zu unterstützen hat sich Silbernetz gegründet - ein Hilfs- und Kontaktangebot für ältere Menschen, das mit seinem Ansatz vereinsamten Älteren hilft, einen Weg aus der Isolation zu finden.
            <br />
            Es ermöglicht anonyme Kontaktaufnahme, den schrittweisen Wiederaufbau persönlicher Verbindung sowie die Vernetzung zu zahlreichen Angeboten für ältere Menschen.
          </p>
        </div>

        <div className="relative z-10 mt-12">
          <p className="font-teaser mx-4">In den sozialen Medien</p>
          <div ref={feedRef} className="flex overflow-x-scroll snap-container p-4 no-scrollbar">
            {instagramPosts.map((post) => <InstaPost key={post.id} post={post} />)}
          </div>
        </div>

        <div className="angled-background bg-kaki -mt-24">
          <p className="font-teaser mt-24 mx-4">Unsere Spendenpartner</p>
          <div className="grid grid-cols-4 gap-2 mx-4 my-8">
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
            <img src="http://placehold.it/500" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InstaPost({ post }) {
  const {
    external_fullname: authorName,
    external_user_link: authorLink,
    external_image: authorImage,
    external_name: authorHandle,
    external_created_timestamp: postDate,
    comment: postContent,
    post_image: postImage,
    post_link: postLink,
    type,
    tags,
  } = post;

  const formattedDate = useMemo(() => formatDistance(new Date(postDate), Date.now(), { locale: getDateFnsLocaleObject(), addSuffix: true }), [postDate]);
  const truncatedContent = useMemo(() => (postContent.length > 200 ? `${postContent.substring(0, 200)}...` : postContent), [postContent]);

  return (
    <div className="flex flex-col flex-shrink-0 w-5/6 max-w-sm rounded-md shadow-card font-open-sans overflow-hidden mx-3 snap-child bg-white">
      <a href={postLink} target="_blank" rel="noreferrer noopener">
        <img src={postImage} alt="" />
      </a>
      <div className="mt-2 p-4 flex-grow">
        <p className="text-xs font-thin">{truncatedContent}</p>
      </div>
      <div className="flex items-center p-4">
        <a href={authorLink} target="_blank" rel="noreferrer noopener" className="flex items-center">
          <img src={authorImage} alt="" className="rounded-full h-12 w-12 border" />
          <div className="text-xs ml-4">
            <p className="font-semibold">{authorName}</p>
            <p>
              {type === 'instagram' ? '@' : ''}
              {authorHandle}
            </p>
            <p>{formattedDate}</p>
          </div>
        </a>
        <div className="flex-grow" />
        <img src={require('../assets/instagram.svg')} alt="" className="ml-2 h-8 w-8" />
      </div>
    </div>
  );
}

export default Anniversary;
