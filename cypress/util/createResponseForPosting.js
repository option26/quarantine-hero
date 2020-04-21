export default function createResponseForPosting(responseText, email) {
  cy.visit('localhost:3000/#/dashboard');
  cy.wait(1000); // wait for data to load
  cy.get('[data-cy=ask-for-help-entry]').invoke('attr', 'data-id').as('askForHelpId');
  cy.get('@askForHelpId')
    .then((askForHelpId) => {
      cy.visit(`localhost:3000/#/offer-help/${askForHelpId}`);
      cy.get('[data-cy=offer-help-text-input]').type(`${responseText}{enter}`);
      cy.get('[data-cy=mail-input]').type(`${email}`);
      cy.get('[data-cy=offer-help-submit]').click();
      cy.get('[data-cy=success-offer-link]').click();
    });
  cy.wait(1000); // wait for data be updated
}
