/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

class CheckoutPage {
  constructor() {
    this.pageTitle = '[data-test="title"]';
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    this.continueButton = '[data-test="continue"]';
    this.finishButton = '[data-test="finish"]';
    this.completeHeader = '[data-test="complete-header"]';
    this.defaultTimeout = 8000;
  }

  fillInfoWithGeneratedData() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postalCode = faker.location.zipCode();

    cy.get(this.pageTitle, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', 'Checkout: Your Information');

    cy.get(this.firstNameInput, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .type(firstName);
    cy.get(this.firstNameInput, { timeout: this.defaultTimeout }).should('have.value', firstName);

    cy.get(this.lastNameInput, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .type(lastName);
    cy.get(this.lastNameInput, { timeout: this.defaultTimeout }).should('have.value', lastName);

    cy.get(this.postalCodeInput, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .type(postalCode);
    cy.get(this.postalCodeInput, { timeout: this.defaultTimeout }).should('have.value', postalCode);

    cy.get(this.continueButton, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  assertOverviewStep() {
    cy.url({ timeout: this.defaultTimeout }).should('include', '/checkout-step-two.html');
    cy.get(this.pageTitle, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', 'Checkout: Overview');
  }

  completeOrder() {
    cy.get(this.finishButton, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  assertOrderComplete() {
    cy.url({ timeout: this.defaultTimeout }).should('include', '/checkout-complete.html');
    cy.get(this.completeHeader, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
  }
}

export default CheckoutPage;
