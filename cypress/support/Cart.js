/// <reference types="cypress" />
class Cart {
  constructor() {
    // Locators
    this.inventoryItem = '.inventory_item';
    this.inventoryItemName = '.inventory_item_name';
    this.cartBadge = '.shopping_cart_badge';
    this.cartLink = '.shopping_cart_link';
    this.cartItem = '.cart_item';
  }

  addProductToCartByName(productName) {
    cy.contains(this.inventoryItemName, productName)
      .parents(this.inventoryItem)
      .find('button')
      .should('be.visible')
      .click();
  }

  openCart() {
    cy.get(this.cartLink, { timeout: 8000 }).should('be.visible').click();
  }

  assertCartBadgeCount(expectedCount) {
    cy.get(this.cartBadge).should('be.visible').and('have.text', String(expectedCount));
  }

  assertCartContainsProduct(productName) {
    cy.get(this.cartItem).find(this.inventoryItemName).should('contain.text', productName);
  }
}

export default Cart;
