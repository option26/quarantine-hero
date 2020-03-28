context('SignUp', () => {

  describe('User is not logged in and no returnUrl', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signup');
      cy.hash().should('equal', '#/signup');
    });

    it('clicking on "Ich habe bereits einen Account" should redirect to signin', () => {
      cy.get('[data-cy=btn-account-exists]').click();
      cy.hash().should('equal', '#/signin');
    });

    it('signup with blacklisted email', () => {
      cy.get('form input[type="email"]').type('florian.schmidt@byom.de{enter}');
      cy.get('#password').type('test1234{enter}');
      cy.get('#password_repeat').type('test1234{enter}');

      cy.get('input[type="email"]:invalid').should('have.length', 1);
      cy.hash().should('equal', '#/signup');
    });

    it('signup with existing email', () => {
      cy.get('form input[type="email"]').type('florian.schmidt.1994@icloud.com{enter}');
      cy.get('#password').type('test1234{enter}');
      cy.get('#password_repeat').type('test1234{enter}');

      cy.hash().should('equal', '#/signup');
      cy.get('[data-cy=error-label]').should('exist');
    });

    it('signup with password mismatch', () => {
      cy.get('form input[type="email"]').type('newuser@qh.de{enter}');
      cy.get('#password').type('test1234{enter}');
      cy.get('#password_repeat').type('test5678{enter}');

      cy.get('#password_repeat:invalid').should('have.length', 1);
      cy.hash().should('equal', '#/signup');
    });

    it('signup with valid input', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('registerUser');

      cy.get('form input[type="email"]').type('newuser@qh.de{enter}');
      cy.get('#password').type('test1234{enter}');
      cy.get('#password_repeat').type('test1234{enter}');

      cy.wait('@registerUser');
      cy.get('input:invalid').should('have.length', 0);
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.hash().should('equal', '#/verify-email');
    });

  });

  describe('User is logged in and email is verified', () => {
    before(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type('florian.schmidt.1994@icloud.com{enter}');
      cy.get('form input[type="password"]').type('test1234{enter}');
      cy.hash().should('equal', '#/signin');
    });

    it('navigating to signin should redirect to /ask-for-help', () => {
      cy.visit('localhost:3000/#/signin');
      cy.hash().should('equal', '#/ask-for-help');
    });

    it('navigating to signin with returnURL should redirect to returnURL', () => {
      cy.visit('localhost:3000/#/signin/overview');
      cy.hash().should('equal', '#/overview');
    });
  });

  describe('User is logged in and email is not verified', () => {
    before(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type('unconfirmed@email.com{enter}');
      cy.get('form input[type="password"]').type('test1234{enter}');
      cy.hash().should('equal', '#/signin');
    });

    it('navigating to signin without returnURL should redirect to /verfiy-email', () => {
      cy.visit('localhost:3000/#/signin');
      cy.hash().should('equal', '#/verify-email');
    });

    it('navigating to signin with returnURL should redirect to returnURL', () => {
      cy.visit('localhost:3000/#/signin/overview');
      cy.hash().should('equal', '#/overview');
    });
  });

});
