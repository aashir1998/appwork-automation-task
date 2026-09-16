/// <reference types="cypress" />
class ProductsPage {
  constructor() {
    this.itemPrice = '[data-test="inventory-item-price"]';
    this.sortDropdown = '[data-test="product-sort-container"]';
    this.activeSortOption = '[data-test="active-option"]';
    this.cartBadge = '[data-test="shopping-cart-badge"]';
    this.cartLink = '[data-test="shopping-cart-link"]';
    this.defaultTimeout = 8000;
  }

  static slugify(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  static addButtonFor(productName) {
    return `[data-test="add-to-cart-${ProductsPage.slugify(productName)}"]`;
  }

  static removeButtonFor(productName) {
    return `[data-test="remove-${ProductsPage.slugify(productName)}"]`;
  }

  addProductToCart(productKey) {
    cy.fixture('products').then(products => {
      const productName = products[productKey];

      cy.get(ProductsPage.addButtonFor(productName), { timeout: this.defaultTimeout })
        .should('be.visible')
        .and('be.enabled')
        .click();
      cy.get(ProductsPage.removeButtonFor(productName), { timeout: this.defaultTimeout }).should(
        'be.visible'
      );
    });
  }

  removeProductFromCart(productKey) {
    cy.fixture('products').then(products => {
      const productName = products[productKey];

      cy.get(ProductsPage.removeButtonFor(productName), { timeout: this.defaultTimeout })
        .should('be.visible')
        .and('be.enabled')
        .click();
      cy.get(ProductsPage.addButtonFor(productName), { timeout: this.defaultTimeout }).should(
        'be.visible'
      );
    });
  }

  openCart() {
    cy.get(this.cartLink, { timeout: this.defaultTimeout }).should('be.visible').click();
    cy.url({ timeout: this.defaultTimeout }).should('include', '/cart.html');
  }

  assertCartBadgeCount(expectedCount) {
    cy.get(this.cartBadge, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', String(expectedCount));
  }

  sortByPriceLowToHigh() {
    cy.get(this.sortDropdown, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('be.enabled')
      .select('lohi');
    cy.get(this.activeSortOption, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', 'Price (low to high)');
  }

  assertPricesSortedAscending() {
    cy.get(this.itemPrice, { timeout: this.defaultTimeout })
      .should('have.length.greaterThan', 0)
      .then($prices => {
        const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).to.deep.equal(sortedPrices);
      });
  }
}

export default ProductsPage;
