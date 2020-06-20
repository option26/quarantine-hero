export interface AskForHelpCollectionEntry {
  uid: string // TODO: check if also available outside of d
  d: {
    uid: string
    timestamp: string
    request: string
    response: number
    location: string
    plz: string
    coordinates: FirebaseFirestore.GeoPoint
    notificationCounter: number
    notificationReceiver: string[]
    reportedBy: string[]
  }
  g: string
  l: string[]
}
