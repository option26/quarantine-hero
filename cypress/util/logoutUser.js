import './firebase';
import * as firebase from 'firebase/app';

export default function logoutUser() {
  return firebase.auth().signOut();
}
