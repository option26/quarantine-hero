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
      cy.hash().should('equal', '#/signup');
    });

    it('clicking on an entry should redirect to offer help', () => {
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });

  describe('User is logged in and his email address has been verified', () => {

    beforeEach(() => {
      cy.visit('localhost:3000');

      // TODO: This yells ANTI-PATTERN. We should find a way to fix this
      cy.wait(2000);
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=btn-sign-out]').length > 0) {
          cy.get('[data-cy=btn-sign-out]').click();
        }
      });

      cy.visit('localhost:3000/#/signup');
      cy.get('form input[type="email"]').type('florian.schmidt.1994@icloud.com{enter}');
      cy.get('form input[type="password"]').type('test1234{enter}');

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

    it('clicking on an entry should redirect to offer help', () => {
      cy.get('.entry').first().click();
      cy.hash().should('contain', '#/offer-help/');
    });
  });
});
