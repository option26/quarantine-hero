import loginVerifiedUser from '../util/loginVerifiedUser';

context('Landing Page', () => {

  describe('User is not logged in', () => {
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
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    beforeEach(() => {
      loginVerifiedUser('florian.schmidt.1994@icloud.com', 'test1234');
    });

    it('clicking on "Ich möchte Helfen" should redirect to overview', () => {
      cy.get('[data-cy=cta-want-to-help').click();
      cy.hash().should('equal', '#/overview');
    });

    it('clicking on "Ich brauche Hilfe" should redirect to signup', () => {
      cy.get('[data-cy=cta-need-help]').click();
      cy.hash().should('equal', '#/ask-for-help');
    });

    it('clicking on an entry should redirect to offer help', () => {
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });
});
