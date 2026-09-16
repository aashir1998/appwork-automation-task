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
  }

  fillInfoWithGeneratedData() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postalCode = faker.location.zipCode();

    cy.get(this.pageTitle).should('be.visible').and('have.text', 'Checkout: Your Information');

    cy.typeAndVerify(this.firstNameInput, firstName);
    cy.typeAndVerify(this.lastNameInput, lastName);
    cy.typeAndVerify(this.postalCodeInput, postalCode);

    cy.clickWhenReady(this.continueButton);
  }

  assertOverviewStep() {
    cy.url().should('include', '/checkout-step-two.html');
    cy.get(this.pageTitle).should('be.visible').and('have.text', 'Checkout: Overview');
  }

  completeOrder() {
    cy.clickWhenReady(this.finishButton);
  }

  assertOrderComplete() {
    cy.url().should('include', '/checkout-complete.html');
    cy.get(this.completeHeader).should('be.visible').and('have.text', 'Thank you for your order!');
  }
}

export default CheckoutPage;
