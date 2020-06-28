const blacklistedEmail = 'example@byom.de';
const verifiedEmailAddress = 'verified@example.com';
const notVerifiedEmailAddress = 'not.verified@example.com';
const password = 'hvskdjghawjrgif7vnjwzgfowbfka';

function randomString() {
  const first = Math.random()
    .toString(36) // base36 = ASCII
    .substring(2, 15);

  const second = Math.random()
    .toString(36) // base36 = ASCII
    .substring(2, 15);

  return first + second;
}
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
      cy.get('form input[type="email"]').type(`${blacklistedEmail}`);
      cy.get('#password').type(password);
      cy.get('#password_repeat').type(password);
      cy.get('#privacy_policy').check();

      cy.get('[data-cy=btn-submit-signup]').click();
      cy.get('input[type="email"]:invalid').should('have.length', 1);
      cy.hash().should('equal', '#/signup');
    });

    it('signup with existing email', () => {
      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}`);
      cy.get('#password').type(password);
      cy.get('#password_repeat').type(password);
      cy.get('#privacy_policy').check();

      cy.get('[data-cy=btn-submit-signup]').click();
      cy.hash().should('equal', '#/signup');
      cy.get('[data-cy=error-label]').should('exist');
    });

    it('signup with password mismatch', () => {
      cy.get('form input[type="email"]').type('doesnt-matter@example.com');
      cy.get('#password').type(password);
      cy.get('#password_repeat').type('test5678');
      cy.get('#privacy_policy').check();

      cy.get('[data-cy=btn-submit-signup]').click();
      cy.get('#password_repeat:invalid').should('have.length', 1);
      cy.hash().should('equal', '#/signup');
    });

    it('signup without privacy-policy consent', () => {
      cy.get('form input[type="email"]').type('doesnt-matter@example.com');
      cy.get('#password').type(password);
      cy.get('#password_repeat').type(password);

      cy.get('[data-cy=btn-submit-signup]').click();
      cy.get('#privacy_policy:invalid').should('have.length', 1);
      cy.hash().should('equal', '#/signup');
    });

    it('signup with valid input', () => {
      cy.server();
      cy.route('POST', 'https://www.googleapis.com/**').as('registerUser');

      cy.get('form input[type="email"]').type(`${randomString()}@qh.de`);
      cy.get('#password').type(password);
      cy.get('#password_repeat').type(password);
      cy.get('#privacy_policy').check();

      cy.get('[data-cy=btn-submit-signup]').click();
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
      cy.get('form input[type="email"]').type(`${verifiedEmailAddress}{enter}`);
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

});
