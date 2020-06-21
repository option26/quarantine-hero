export interface NotificationsCollectionEntry {
  d: {
    uid: string
    timestamp: number
    email: string
    location: string
    plz: string
    coordinates: FirebaseFirestore.GeoPoint
    distance?: number // set on searchAndSendNotificationEmails
  }
  g: string
  l: string[]
}
