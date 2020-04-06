context('Verify Email Page', () => {

  describe('User is not logged in', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/verify-email');
    });

    it('visiting the page should redirect to sign up', () => {
      cy.hash().should('equal', '#/signup');
    });
  });

  describe('User is logged in and his email address has not been verified', () => {

    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type('not.verified@example.com{enter}');
      cy.get('form input[type="password"]').type('test1234{enter}');
    });

    it('visiting the page should not redirect him', () => {
      cy.visit('localhost:3000/#/verify-email');
      cy.hash().should('equal', '#/verify-email');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type('verified@example.com{enter}');
      cy.get('form input[type="password"]').type('test1234{enter}');
    });

    it('visiting the page should redirect to ask-for-help', () => {
      cy.visit('localhost:3000/#/verify-email');
      cy.hash().should('equal', '#/ask-for-help');
    });
  });
});
