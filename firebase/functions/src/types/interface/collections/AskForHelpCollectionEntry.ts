export interface AskForHelpCollectionEntry {
  d: {
    uid: string
    timestamp: number
    lastHelpRequestTimestamps?: number[] // not set for old entries
    timestampLastEngagementAttempt?: number
    request: string
    responses?: number
    location: string
    plz: string
    coordinates: FirebaseFirestore.GeoPoint
    notificationCounter: number
    notificationReceiver: string[]
    reportedBy: string[]
    slackMessageRef?: string
    isHotline?: boolean
  };
  g: string;
  l: string[];
}
