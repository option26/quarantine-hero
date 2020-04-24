import { verifiedEmailAddress, notExistingEmailAddress, password } from '../util/loginUser';

context('SignIn', () => {
  describe('User is not logged in and no returnUrl', () => {
    beforeEach(() => {
      cy.logout();

      cy.visit('localhost:3000/#/signin');
      cy.hash().should('equal', '#/signin');
    });

    it('clicking on "Neu registrieren" should redirect to signup', () => {
      cy.get('[data-cy=btn-register]').click();
      cy.hash().should('equal', '#/signup');
    });

    it('signin with valid credentials', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo**').as('signInUser'); //TODO: Example for having the full URL, this, however was not used everywhere yet and might not be necesasry at all

      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type(`${password}{enter}`);

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.hash().should('equal', '#/ask-for-help');
    });

    //TODO: This test fails as there is a second call to /getAccountInfo which leads to the fact that a user gets logged in aagain after it was logged out
    //TODO: This only happens if we do not wait in the previous test. if we wait, the second request does not seem to be executed.
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

      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type('wrong-password{enter}');

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin');
    });
  });

  describe('User is not logged in and returnUrl is /overview', () => {
    beforeEach(() => {
      cy.logout();

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

      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
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

      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
      cy.get('form input[type="password"]').type('wrong-password{enter}');

      cy.wait('@signInUser');
      cy.get('[data-cy=error-label]').should('exist');
      cy.hash().should('equal', '#/signin/overview');
    });
  });

  describe('User is logged in and email is verified', () => {
    before(() => {
      cy.logout();

      cy.loginVerified();
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
      cy.logout();

      cy.loginNotVerified();
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
    before(() => {
      cy.logout();
    });

    beforeEach(() => {
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
      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
      cy.get('[data-cy=btn-pw-reset]').click();
      cy.get('[data-cy=error-label]').should('not.exist');
      cy.get('[data-cy=pw-reset-success-label]').should('exist');
    });
  });
});
