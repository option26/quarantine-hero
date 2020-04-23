import './firebase';
import * as firebase from 'firebase/app';

export const verifiedEmailAddress = 'verified@example.com';
export const secondaryEmailAddress = 'secondary@example.com';
export const notVerifiedEmailAddress = 'not.verified@example.com';
export const notExistingEmailAddress = 'not.existing@example.com';
export const password = 'test1234';

export function loginUser(email, pw) {
  cy.logout().then(() => firebase.auth().signInWithEmailAndPassword(email, pw));
}

export function loginVerifiedUser() {
  return loginUser(verifiedEmailAddress, password);
}

export function loginSecondaryUser() {
  return loginUser(secondaryEmailAddress, password);
}

export function loginNotVerifiedUser() {
  return loginUser(notVerifiedEmailAddress, password);
}

export function loginNotExistingUser() {
  return loginUser(notExistingEmailAddress, password);
}
