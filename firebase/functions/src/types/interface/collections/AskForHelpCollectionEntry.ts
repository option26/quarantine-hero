export interface AskForHelpCollectionEntry {
  d: {
    uid: string
    timestamp: number
    timeStampLastHelpRequest: number
    request: string
    response: number
    location: string
    plz: string
    coordinates: FirebaseFirestore.GeoPoint
    notificationCounter: number
    notificationReceiver: string[]
    reportedBy: string[]
    slackMessageRef?: string
  };
  g: string;
  l: string[];
}
