import loginVerifiedUser from '../util/loginVerifiedUser';
import createAskForHelpPosting from '../util/createAskForHelpPosting';
import createResponseForPosting from '../util/createResponseForPosting';
import { removeAskForHelpEntryWithoutResponses, removeSolvedAskForHelpEntry } from '../util/removeExistingAskForHelpEntries';

const dummyUserMail = 'verified@example.com';
const dummyUserPw = 'test1234';

context('Dashboard', () => {

  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('localhost:3000');
    loginVerifiedUser(dummyUserMail, dummyUserPw);
  });

  describe('user has no entries', () => {

    beforeEach(() => {
      cy.visit('localhost:3000/#/dashboard');
    });

    it('should show the OPEN tab by default', () => {
      cy.get('[data-cy=tabs-open]').click();
      cy.get('[data-cy=tabs-open-content]').should('be.visible');
    });

    it('should show the SOLVED tab when selecting it', () => {
      cy.get('[data-cy=tabs-solved]').click();
      cy.get('[data-cy=tabs-solved-content]').should('be.visible');
    });
  });

  describe('user has one open entry without any responses', () => {

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", and 2) cancel when clicking the "ABBRECHEN" button and take the user back to the dashboard', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 1!`);
      cy.wait(3000); // wait for data to be created server-side

      // test behaviour
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with popup content
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');

      // cancel deletion process
      cy.get('[data-cy=btn-popup-cancel-positive]').click();

      // status should be same as initial status
      cy.get('.popup-content').should('not.be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=ask-for-help-entry]').should('be.visible');

      // remove posting
      removeAskForHelpEntryWithoutResponses();
    });

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", 2) show a success confirmation when clicking on "ENDGÜLTIG LÖSCHEN" and 3) take the user back to the overview when clicking on "ZURÜCK ZUR ÜBERSICHT"', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 2!`);
      cy.wait(3000); // wait for data to be created server-side

      // test behaviour
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with popup content
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');
      // delete entry
      cy.get('[data-cy=btn-popup-delete-terminally]').click();
      cy.wait(500); // wait for popup to render

      // click "ZURÜCK ZUR ÜBERSICHT" in the following success confirmation
      cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').click();

      // make sure popup content is not visible
      cy.get('.popup-content').should('not.be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('not.be.visible');

      // make sure entry is removed (at least UI side)
      cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('not.be.visible');
      cy.get('[data-cy=ask-for-help-entry]').should('not.be.visible');
    });
  });

  describe('user has one open entry with responses', () => {

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", 2) move the entry to solved if clicking the "HELD*IN GEFUNDEN" button in the popup and 3) take the user back to the overview when clicking on "ZURÜCK ZUR ÜBERSICHT"', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 3!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // test behaviour
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with popup content
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-anyway]').should('be.visible');

      // mark as solved
      cy.get('[data-cy=btn-popup-hero-found]').click();

      // entry should be removed
      cy.get('.popup-content').should('not.be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-delete-anyway]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('not.be.visible');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('not.be.visible');

      // cleanup: remove posting after reload
      cy.reload(); // reload to fetch updated data
      removeSolvedAskForHelpEntry();
    });

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", 2) delete the entry if clicking the "DELETE ANYWAY button in the popup and 3) take the user back to the overview when clicking on "ZURÜCK ZUR ÜBERSICHT"', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 4!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // test behaviour
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with popup content
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-anyway]').should('be.visible');

      // cancel deletion process
      cy.get('[data-cy=btn-popup-delete-anyway]').click();

      // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
      cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').click();
      cy.wait(3000); // wait for deletion

      // entry should be gone
      cy.get('.popup-content').should('not.be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-delete-anyway]').should('not.be.visible');
      cy.get('[data-cy=ask-for-help-entry]').should('not.be.visible');
    });

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", 2) delete the entry if clicking the "DELETE ANYWAY button in the popup and 3) take the user back to the ask-for-help page when clicking on "NEUE ANFRAGE ERSTELLEN"', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 5!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // test behaviour
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with popup content
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-anyway]').should('be.visible');

      // cancel deletion process
      cy.get('[data-cy=btn-popup-delete-anyway]').click();

      // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
      cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
      cy.get('[data-cy=btn-popup-ask-for-help]').click();
      cy.wait(1000); // wait for deletion

      // check redirect was successful
      cy.hash().should('equal', '#/ask-for-help');
    });

    it('should 1) show a reassurement popup when clicking on "HELD*IN GEFUNDEN" and 2) mark an entry as solved when clicking the "HELD*IN GEFUNDEN" button in the popup', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 6!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // mark as solved
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').click();
      // engage with button in popup
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-negative]').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').click();
      cy.wait(5000); // wait for data to be updated server-side

      // entry should not be visible in "OPEN" tab anymore
      cy.get('[data-cy=btn-popup-hero-found]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-cancel-negative]').should('not.be.visible');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('not.be.visible');

      // navigate to "ABGESCHLOSSEN" TAB
      cy.reload(); // reload to fetch updated data
      cy.get('[data-cy=tabs-solved]').click();
      cy.get('[data-cy=tabs-solved-content]').should('be.visible');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');

      removeSolvedAskForHelpEntry();
    });
  });

  describe('user has one solved entry with responses', () => {

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", and 2) cancel when clicking the "ABBRECHEN" button and take the user back to the overview', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 7!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // mark as solved
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').click();

      // engage with solve button in popup
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-negative]').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').click();
      cy.wait(5000); // wait for data to be updated server-side

      // navigate to "ABGESCHLOSSEN" TAB
      cy.reload(); // reload to fetch updated data
      cy.get('[data-cy=tabs-solved]').click();
      cy.get('[data-cy=tabs-solved-content]').should('be.visible');

      // get solved entry and initiate deletion
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with cancel button in popup
      cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').click();

      // should be back on dashboard
      cy.get('.popup-content').should('not.be.visible');
      cy.get('[data-cy=btn-popup-cancel-positive]').should('not.be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('not.be.visible');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');

      // cleanup
      removeSolvedAskForHelpEntry();
    });

    it('should 1) show a reassurement popup when clicking on "LÖSCHEN", 2) show a success confirmation when clicking on "ENDGÜLTIG LÖSCHEN" and 3) take the user back to the overview when clicking on "ZURÜCK ZUR ÜBERSICHT"', () => {
      // create a new posting
      createAskForHelpPosting('68159', `dashboard.spec.js ${new Date().toUTCString()} test case 8!`);
      cy.wait(3000); // wait for data to be created server-side
      createResponseForPosting(`dashboard.spec.js ${new Date().toUTCString()} I can help you!`, dummyUserMail);
      cy.wait(3000); // wait for data to be created server-side

      // mark as solved
      cy.visit('localhost:3000/#/dashboard');
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').click();

      // engage with solve button in popup
      cy.get('.popup-content').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
      cy.get('[data-cy=btn-popup-cancel-negative]').should('be.visible');
      cy.get('[data-cy=btn-popup-hero-found]').click();
      cy.wait(5000); // wait for data to be updated server-side

      // navigate to "ABGESCHLOSSEN" TAB
      cy.reload(); // reload to fetch updated data
      cy.get('[data-cy=tabs-solved]').click();
      cy.get('[data-cy=tabs-solved-content]').should('be.visible');

      // get entry
      cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
      cy.get('[data-cy=btn-entry-solve]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').should('be.visible');
      cy.get('[data-cy=btn-entry-delete]').first().click();

      // engage with delete terminally button in popup
      cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');
      cy.get('[data-cy=btn-popup-delete-terminally]').click();
      cy.wait(500); // wait for popup

      // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
      cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
      cy.get('[data-cy=btn-popup-back-to-overview]').click();
      cy.wait(1000); // wait for deletion
      cy.get('.popup-content').should('not.be.visible');
    });
  });
});
