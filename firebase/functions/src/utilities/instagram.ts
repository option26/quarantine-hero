import * as functions from "firebase-functions";
import { IgApiClient } from "instagram-private-api";

const { username: USERNAME, password: PASSWORD } = functions.config().instagram;
const USER_ID = 31574507281;
const loadMoreCounterSanityCheck = 10;

const ig = new IgApiClient();
// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(USERNAME);

export default async function getReelShares(limitTimestamp: number) {
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  await ig.simulate.preLoginFlow();
  await ig.account.login(USERNAME, PASSWORD);
  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(() => ig.simulate.postLoginFlow());

  const messageFeed = ig.feed.directInbox();

  let counter = 0;
  let loadMoreCounter = 0;

  const messages = [];
  const initialMessages = await messageFeed.items();
  messages.push(...initialMessages);

  while (messages.length > 0) {
    const message = messages.shift()!;

    const lastActivityTimestamp = Math.round(Number.parseInt(message.last_activity_at, 10) / 1000);
    if (lastActivityTimestamp < limitTimestamp) {
      break;
    }

    const items = message.items.filter((item) => {
      const parsedTimestamp = Math.round(Number.parseInt(item.timestamp, 10) / 1000);
    
      const { item_type: itemType, reel_share: reelShare } = item as unknown as { item_type: string, reel_share: { type: string, mentioned_user_id: number } };
      return parsedTimestamp >= limitTimestamp && itemType === 'reel_share' && reelShare.type === 'mention' && reelShare.mentioned_user_id === USER_ID;
    });

    counter += items.length;

    if (messages.length === 0) {
      if (loadMoreCounter > loadMoreCounterSanityCheck) {
        console.log('Sanity check not passed');
        break;
      }

      loadMoreCounter += 1;

      // eslint-disable-next-line no-await-in-loop
      messages.push(...(await messageFeed.items()));
    }
  }

  return counter;
}
