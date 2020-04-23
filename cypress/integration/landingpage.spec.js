import createAskForHelpPosting from '../util/createAskForHelpPosting';

context('Landing Page', () => {

  describe('User is not logged in', () => {
    before(() => {
      // Make sure there is at least one entry
      cy.loginVerified();
      createAskForHelpPosting('68159');

      cy.logout();
    });

    beforeEach(() => {
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
      cy.get('[data-cy*=ask-for-help-entry]').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    before(() => {
      // Make sure there is at least one own entry
      cy.loginSecondary();
      cy.createAskForHelp('95182');

      cy.loginVerified();
      cy.createAskForHelp('68159');
    });

    beforeEach(() => {
      cy.visit('localhost:3000');
    });

    it('clicking on "Ich möchte Helfen" should redirect to overview', () => {
      cy.get('[data-cy=cta-want-to-help').click();
      cy.hash().should('equal', '#/overview');
    });

    it('clicking on "Ich brauche Hilfe" should redirect to ask-for-help', () => {
      cy.get('[data-cy=cta-need-help]').click();
      cy.hash().should('equal', '#/ask-for-help');
    });

    it('clicking on own entry should redirect to dashboard', () => {
      cy.get('[data-cy*=ask-for-help-entry][data-cy*=own]').first().click();
      cy.hash().should('contain', '#/dashboard');
    });

    it('clicking on other entry should redirect to offer-help', () => {
      cy.get('[data-cy*=ask-for-help-entry]:not([data-cy*=own])').first().click();
      cy.hash().should('contain', '#/offer-help/');
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
        cy.get('[data-cy=mobile-nav-sign-out]', { timeout: 5000 }).should('be.visible');
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
