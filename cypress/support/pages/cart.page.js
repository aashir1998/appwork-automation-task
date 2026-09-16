/// <reference types="cypress" />
class CartPage {
  constructor() {
    this.cartItemName = '[data-test="inventory-item-name"]';
    this.checkoutButton = '[data-test="checkout"]';
  }

  assertContainsProduct(productKey) {
    cy.fixture('products').then(products => {
      cy.get(this.cartItemName).should('be.visible').and('have.text', products[productKey]);
    });
  }

  startCheckout() {
    cy.clickWhenReady(this.checkoutButton);
    cy.url().should('include', '/checkout-step-one.html');
  }
}

export default CartPage;
