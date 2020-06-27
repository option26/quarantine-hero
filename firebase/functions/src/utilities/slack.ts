import axios from 'axios';
import * as functions from 'firebase-functions';
import { AskForHelpCollectionEntry } from '../types/interface/collections/AskForHelpCollectionEntry';

async function postToSlack(snapId: string, snapData: AskForHelpCollectionEntry): Promise<void> {
  const { request, plz, location } = snapData.d;

  await axios({
    method: 'POST',
    url: functions.config().slack.url,
    headers: {
      'Content-type': 'application/json',
    },
    data: {
      text: `https://www.quarantaenehelden.org/#/offer-help/${snapId}\n${plz} - ${location}\n>${request.replace('\n', '\n>')}`,
    },
  });
};

export { postToSlack };
