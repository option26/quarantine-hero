import loginVerifiedUser from '../util/loginVerifiedUser';

context('Dashboard', () => {

  beforeEach(() => {
    cy.visit('localhost:3000');
    loginVerifiedUser('koxife6299@fft-mail.com', 'test1234');
  });

  describe('user has no entries', () => {

    beforeEach(() => {
      cy.visit('localhost:3000/#/dashboard');
      // TODO: log into a user with no entries
    });

    it('should show the OPEN tab by default', () => {
      cy.get('[data-cy=tabs-open]').click();
      cy.get('[data-cy=tabs-open-content]').should('be.visible');
    });

    it('should show the SOLVED tab when selecting it', () => {
      cy.get('[data-cy=tabs-solved]').click();
      cy.get('[data-cy=tabs-solved-content]').should('be.visible');
    });
  });

  describe('user has one open entry without responses', () => {

    // before(() => {
    //   // TODO: create "ask-for-help" collection entry for user
    // });

    it('should show a reassurement popup when clicking on delete', () => {
      // TODO: test popup buttons
    });

  });

  describe('user has one open entry with responses', () => {

    // before(() => {
    //   // TODO: create "ask-for-help" collection entry for user
    //   // TODO: add responses
    // })

    it('should show a reassurement popup when clicking on delete', () => {
      // TODO: test popup buttons
    });

    it('should show ask the user if he wants to mark the entry as solved instead when clicking on delete for an entry with a response', () => {
      // TODO: test popup buttons
    });

  });
  // TODO: clicking on open should show open tab
  // TODO: clicking on closed should show closed tab
  // TODO: clicking bin should show popup depending on entry
  // etc.
});
