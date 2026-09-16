/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

class Checkout {
  constructor() {
    // Locators
    this.checkoutButton = '#checkout';
    this.firstNameInput = '#first-name';
    this.lastNameInput = '#last-name';
    this.postalCodeInput = '#postal-code';
    this.continueButton = '#continue';
    this.finishButton = '#finish';
    this.completeHeader = '.complete-header';
  }

  startCheckout() {
    cy.get(this.checkoutButton, { timeout: 8000 }).should('be.visible').click();
  }

  fillCheckoutInfoWithGeneratedData() {
    const defaultTimeout = 8000;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postalCode = faker.location.zipCode();

    cy.get(this.firstNameInput, { timeout: defaultTimeout }).should('be.visible').type(firstName);
    cy.get(this.lastNameInput, { timeout: defaultTimeout }).should('be.visible').type(lastName);
    cy.get(this.postalCodeInput, { timeout: defaultTimeout }).should('be.visible').type(postalCode);
    cy.get(this.continueButton, { timeout: defaultTimeout }).should('be.visible').click();
  }

  completeOrder() {
    cy.get(this.finishButton, { timeout: 8000 }).should('be.visible').click();
  }

  assertOrderComplete() {
    cy.get(this.completeHeader).should('be.visible').and('have.text', 'Thank you for your order!');
  }
}

export default Checkout;
