/// <reference types="cypress" />
class Products {
  constructor() {
    // Locators
    this.sortDropdown = '.product_sort_container';
    this.itemPrice = '.inventory_item_price';
  }

  sortProductsByPriceLowToHigh() {
    cy.get(this.sortDropdown, { timeout: 8000 }).should('be.visible').select('lohi');
  }

  assertPricesSortedAscending() {
    cy.get(this.itemPrice)
      .should('have.length.greaterThan', 0)
      .then($prices => {
        const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).to.deep.equal(sortedPrices);
      });
  }
}

export default Products;
