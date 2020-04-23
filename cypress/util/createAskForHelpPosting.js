export default function createAskForHelpPosting(postalCode, description = `Test ${new Date().toISOString()}`) {
  cy.visit('localhost:3000/#/ask-for-help');
  cy.get('[data-cy=location-search-input]').type(`${postalCode}`);
  cy.get('[data-cy=autocomplete-suggestion]').first().click();
  cy.get('[data-cy=ask-for-help-text-input]').type(description);
  cy.get('[data-cy=ask-for-help-submit]').click();
  cy.get('[data-cy=success-link-to-dashboard]').click();
}