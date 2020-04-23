// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import { loginVerifiedUser, loginSecondaryUser, loginNotVerifiedUser } from '../util/loginUser';
import logoutUser from '../util/logoutUser';
import createAskForHelpPosting from '../util/createAskForHelpPosting';
import createResponseForPosting from '../util/createResponseForPosting';

// -- This is a parent command --
Cypress.Commands.add('loginVerified', loginVerifiedUser);
Cypress.Commands.add('loginSecondary', loginSecondaryUser);
Cypress.Commands.add('loginNotVerified', loginNotVerifiedUser);
Cypress.Commands.add('logout', logoutUser);

Cypress.Commands.add('createAskForHelp', createAskForHelpPosting);
Cypress.Commands.add('createResponse', createResponseForPosting);
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
