/// <reference types="cypress" />

Cypress.Commands.add('clickWhenReady', selector => {
  cy.get(selector).should('be.visible').and('be.enabled').click();
});

Cypress.Commands.add('typeAndVerify', (selector, value) => {
  cy.get(selector).should('be.visible').and('be.enabled').type(value);
  cy.get(selector).should('have.value', value);
});
