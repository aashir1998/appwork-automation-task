/// <reference types="cypress" />
class CartPage {
  constructor() {
    this.cartItemName = '[data-test="inventory-item-name"]';
    this.checkoutButton = '[data-test="checkout"]';
    this.defaultTimeout = 8000;
  }

  assertContainsProduct(productName) {
    cy.get(this.cartItemName, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', productName);
  }

  startCheckout() {
    cy.get(this.checkoutButton, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .click();
    cy.url({ timeout: this.defaultTimeout }).should('include', '/checkout-step-one.html');
  }
}

export default CartPage;
