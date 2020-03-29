const verifiedEmailAdress = 'verified@example.com';
const notVerifiedEmailAddress = 'not.verified@example.com';
const notExistingEmailAddress = 'not.existing@example.com';
const password = 'test1234';

context('SignIn', () => {
  describe('User is not logged in and no returnUrl', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.hash().should('equal', '#/signin');
    });

    it('clicking on "Neu registrieren" should redirect to signup', () => {
      cy.get('[data-cy=btn-register]').click();
      cy.hash().should('equal', '#/signup');
    });

    it('signin with valid credentials', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.hash().should('equal', '#/ask-for-help');
    });

    it('signin with invalid email', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${notExistingEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin');
    });

    it('signin with invalid password', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type('wrong-password{enter}');

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin');
    });
  });

  describe('User is not logged in and returnUrl is /overview', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin/overview');
      cy.hash().should('equal', '#/signin/overview');
    });

    it('clicking on "Neu registrieren" should redirect to signup', () => {
      cy.get('[data-cy=btn-register]').click();
      cy.hash().should('equal', '#/signup/overview');
    });

    it('signin with valid credentials', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.hash().should('equal', '#/overview');
    });

    it('signin with email address that has no account', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${notExistingEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin/overview');
    });

    it('signin with invalid password', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('signInUser');

      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type('wrong-password{enter}');

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin/overview');
    });
  });

  describe('User is logged in and email is verified', () => {
    before(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);
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
      cy.get('form input[type="email"]').type(`${notVerifiedEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);
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

  describe('User requests password reset', () => {
    beforeEach(() => {
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      cy.visit('localhost:3000/#/signin');
      cy.hash().should('equal', '#/signin');
    });

    it('clicking without specifying any email should fail', () => {
      cy.get('[data-cy=btn-pw-reset]').click();
      cy.get('[data-cy=error-label]').should('exist');
    });

    it('clicking without specifying an existing email should fail', () => {
      cy.get('form input[type="email"]').type(`${notExistingEmailAddress}{enter}`);
      cy.get('[data-cy=btn-pw-reset]').click();
      cy.get('[data-cy=error-label]').should('exist');
    });

    it('clicking with an existing email should succeed', () => {
      cy.get('form input[type="email"]').type(`${verifiedEmailAdress}{enter}`);
      cy.get('[data-cy=btn-pw-reset]').click();
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.get('[data-cy=pw-reset-success-label]').should('exist');
    });
  });
});
