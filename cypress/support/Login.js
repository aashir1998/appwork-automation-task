/// <reference types="cypress" />
class Login {
  constructor() {
    // Locators
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
    this.productsTitle = '.title';
  }

  loginUsingUi(userKey) {
    const defaultTimeout = 8000;

    cy.visit('/');

    cy.fixture('users').then(({ users, password }) => {
      cy.get(this.usernameInput, { timeout: defaultTimeout })
        .should('be.visible')
        .type(users[userKey]);
      cy.get(this.passwordInput, { timeout: defaultTimeout }).should('be.visible').type(password);
      cy.get(this.loginButton, { timeout: defaultTimeout }).should('be.visible').click();
    });
  }

  assertLoginSuccess() {
    cy.url().should('include', '/inventory.html');
    cy.get(this.productsTitle).should('be.visible').and('have.text', 'Products');
  }

  assertLoginError(expectedMessage) {
    cy.url().should('not.include', '/inventory.html');
    cy.get(this.errorMessage).should('be.visible').and('contain.text', expectedMessage);
  }
}

export default Login;
