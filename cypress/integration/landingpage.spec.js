const verifiedEmailAdress = 'verified@example.com';
const password = 'test1234';

context('Landing Page', () => {

  describe('User is not logged in', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000');
    });

    it('clicking on "Ich möchte Helfen" should redirect to overview', () => {
      cy.get('[data-cy=cta-want-to-help]').click();
      cy.hash().should('equal', '#/overview');
    });

    it('clicking on "Ich brauche Hilfe" should redirect to signup', () => {
      cy.get('[data-cy=cta-need-help]').click();
      cy.hash().should('equal', '#/signup/ask-for-help');
    });

    it('clicking on an entry should redirect to offer help', () => {
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    beforeEach(() => {
      cy.visit('localhost:3000');

      indexedDB.deleteDatabase('firebaseLocalStorageDb');

      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      // TODO: Why do we redirect to ask-for-help here!
      cy.hash().should('equal', '#/ask-for-help');

      cy.visit('localhost:3000');
    });

    it('clicking on "Ich möchte Helfen" should redirect to overview', () => {
      cy.get('[data-cy=cta-want-to-help').click();
      cy.hash().should('equal', '#/overview');
    });

    it('clicking on "Ich brauche Hilfe" should redirect to signup', () => {
      cy.get('[data-cy=cta-need-help]').click();
      cy.hash().should('equal', '#/ask-for-help');
    });

    // TODO: The redirect depends on the ownership of the entry.
    //  We need to split this and find a way to prepare the test
    it.skip('clicking on an entry should redirect to dashboard', () => {
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/dashboard');
    });

    it('clicking on "Meine Übersicht" should redirect to dashboard', () => {
      if (Cypress.env('VIEWPORT') === 'desktop') {
        cy.get('[data-cy=nav-my-overview]').click();
      } else if (Cypress.env('VIEWPORT') === 'mobile') {
        cy.get('[data-cy=mobile-menu-icon]').click();
        cy.get('[data-cy=mobile-nav-my-overview]').click();
      } else {
        throw new Error('Unknown environment variable VIEWPORT');
      }
      cy.hash().should('equal', '#/dashboard');
    });

    it('clicking on "Logout" should log out the user', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signOutUser');
      if (Cypress.env('VIEWPORT') === 'desktop') {
        cy.get('[data-cy=btn-sign-out]').click();
        cy.get('[data-cy=btn-sign-out]').should('not.exist');
        cy.get('[data-cy=nav-my-overview]').should('not.exist');
      } else if (Cypress.env('VIEWPORT') === 'mobile') {
        cy.get('[data-cy=mobile-menu-icon]').click();
        cy.get('[data-cy=mobile-nav-sign-out]').should('be.visible');
        cy.get('[data-cy=mobile-nav-sign-out]').click();
        cy.get('[data-cy=mobile-menu-icon]').click();
        cy.get('[data-cy=mobile-nav-sign-out]').should('not.exist');
        cy.get('[data-cy=mobile-nav-my-overview]').should('not.exist');
      } else {
        throw new Error('Unknown environment variable VIEWPORT');
      }
    });
  });
});
