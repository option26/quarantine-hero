export interface NotificationsCollectionEntry {
  uid: string;
  timestamp: number;
  email: string;
  location: string;
  plz: string;
  coordinates: FirebaseFirestore.GeoPoint;
  distance?: number; // set on searchAndSendNotificationEmails
  g: {
    geohash: string;
    geopoint: FirebaseFirestore.GeoPoint;
  };
}
