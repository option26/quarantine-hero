// TODO: Put this into one function and handle it via query parameter

export function removeAskForHelpEntryWithoutResponses() {
  cy.get('[data-cy=ask-for-help-entry]').should('be.visible');
  cy.get('[data-cy=btn-entry-solve]').should('not.be.visible');
  cy.get('[data-cy=btn-entry-delete]').should('be.visible');
  cy.get('[data-cy=btn-entry-delete]').first().click();

  // engage with popup content
  cy.get('.popup-content').should('be.visible');
  cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-terminally]').click();

  // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
  cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').click();
  cy.wait(1000); // wait for deletion
  cy.get('.popup-content').should('not.be.visible');
}

export function removeAskForHelpEntryWithResponses() {
  cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
  cy.get('[data-cy=btn-entry-solve]').should('be.visible');
  cy.get('[data-cy=btn-entry-delete]').should('be.visible');
  cy.get('[data-cy=btn-entry-delete]').first().click();

  // engage with popup content
  cy.get('.popup-content').should('be.visible');
  cy.get('[data-cy=btn-popup-hero-found]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-anyway]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-anyway]').click();

  // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
  cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').click();
  cy.wait(1000); // wait for deletion
  cy.get('.popup-content').should('not.be.visible');
}

export function removeSolvedAskForHelpEntry() {
  cy.get('[data-cy=tabs-solved]').click();
  cy.get('[data-cy=tabs-solved-content]').should('be.visible');

  // get entry
  cy.get('[data-cy=ask-for-help-entry-with-responses]').should('be.visible');
  cy.get('[data-cy=btn-entry-solve]').should('be.visible');
  cy.get('[data-cy=btn-entry-delete]').should('be.visible');
  cy.get('[data-cy=btn-entry-delete]').first().click();
  // engage popup content
  cy.get('[data-cy=btn-popup-cancel-positive]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-terminally]').should('be.visible');
  cy.get('[data-cy=btn-popup-delete-terminally]').click({ force: true });
  cy.wait(500); // wait for popup

  // click "ZURÜCK ZUR ÜBERSICHT" in the following popup
  cy.get('[data-cy=btn-popup-ask-for-help]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').should('be.visible');
  cy.get('[data-cy=btn-popup-back-to-overview]').click();
  cy.wait(1000); // wait for deletion
  cy.get('.popup-content').should('not.be.visible');
  cy.wait(2000);
}
