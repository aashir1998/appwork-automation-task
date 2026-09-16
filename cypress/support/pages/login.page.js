/// <reference types="cypress" />
class LoginPage {
  constructor() {
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '[data-test="error"]';
    this.pageTitle = '[data-test="title"]';
  }

  loginUsingUi(userKey) {
    cy.visit('/');

    cy.fixture('users').then(({ users, password }) => {
      cy.typeAndVerify(this.usernameInput, users[userKey]);
      cy.typeAndVerify(this.passwordInput, password);
      cy.clickWhenReady(this.loginButton);
    });
  }

  assertLoginSuccess() {
    cy.url().should('include', '/inventory.html');
    cy.get(this.pageTitle).should('be.visible').and('have.text', 'Products');
  }

  assertLoginError(userKey) {
    cy.url().should('not.include', '/inventory.html');
    cy.fixture('users').then(({ errorMessages }) => {
      cy.get(this.errorMessage).should('be.visible').and('contain.text', errorMessages[userKey]);
    });
  }
}

export default LoginPage;
