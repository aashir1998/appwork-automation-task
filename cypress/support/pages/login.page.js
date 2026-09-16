/// <reference types="cypress" />
class LoginPage {
  constructor() {
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '[data-test="error"]';
    this.pageTitle = '[data-test="title"]';
    this.defaultTimeout = 8000;
  }

  loginUsingUi(userKey) {
    cy.visit('/');

    cy.fixture('users').then(({ users, password }) => {
      cy.get(this.usernameInput, { timeout: this.defaultTimeout })
        .should('be.visible')
        .and('be.enabled')
        .type(users[userKey]);
      cy.get(this.usernameInput, { timeout: this.defaultTimeout }).should(
        'have.value',
        users[userKey]
      );

      cy.get(this.passwordInput, { timeout: this.defaultTimeout })
        .should('be.visible')
        .and('be.enabled')
        .type(password);
      cy.get(this.passwordInput, { timeout: this.defaultTimeout }).should('have.value', password);

      cy.get(this.loginButton, { timeout: this.defaultTimeout })
        .should('be.visible')
        .and('be.enabled')
        .click();
    });
  }

  assertLoginSuccess() {
    cy.url({ timeout: this.defaultTimeout }).should('include', '/inventory.html');
    cy.get(this.pageTitle, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('have.text', 'Products');
  }

  assertLoginError(expectedMessage) {
    cy.url({ timeout: this.defaultTimeout }).should('not.include', '/inventory.html');
    cy.get(this.errorMessage, { timeout: this.defaultTimeout })
      .should('be.visible')
      .and('contain.text', expectedMessage);
  }
}

export default LoginPage;
