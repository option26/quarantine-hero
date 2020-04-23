context('Verify Email Page', () => {

  describe('User is not logged in', () => {
    before(() => {
      cy.logout();
    });

    it('visiting the page should redirect to sign up', () => {
      cy.visit('localhost:3000/#/verify-email');
      cy.hash().should('equal', '#/signup');
    });
  });

  describe('User is logged in and his email address has not been verified', () => {

    before(() => {
      cy.logout();

      cy.loginNotVerified();
    });

    it('visiting the page should not redirect him', () => {
      cy.visit('localhost:3000/#/verify-email');
      cy.hash().should('equal', '#/verify-email');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    before(() => {
      cy.logout();

      cy.loginVerified();
    });

    it('visiting the page should redirect to ask-for-help', () => {
      cy.visit('localhost:3000/#/verify-email');
      cy.hash().should('equal', '#/ask-for-help');
    });
  });
});
