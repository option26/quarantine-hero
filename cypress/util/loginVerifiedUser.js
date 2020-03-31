export default function loginVerifiedUser(email, password) {
  cy.visit('localhost:3000');

  // TODO: This yells ANTI-PATTERN. We should find a way to fix this
  cy.wait(2000);
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=btn-sign-out]').length > 0) {
      cy.get('[data-cy=btn-sign-out]').click();
    }
  });

  cy.visit('localhost:3000/#/signup');
  cy.get('form input[type="email"]').type(`${email}{enter}`);
  cy.get('form input[type="password"]').type(`${password}{enter}`);

  // TODO: Why do we redirect to ask-for-help here!
  cy.hash().should('equal', '#/ask-for-help');

  cy.visit('localhost:3000');
}
