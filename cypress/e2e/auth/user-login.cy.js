import LoginPage from '../../support/pages/login.page';

describe('User Login', { tags: ['@Smoke', '@Regression'] }, () => {
  it('Logs in successfully with a valid standard user', () => {
    const login = new LoginPage();

    login.loginUsingUi('standard');
    login.assertLoginSuccess();
  });

  it('Rejects login for a locked out user', () => {
    const login = new LoginPage();

    login.loginUsingUi('lockedOut');
    login.assertLoginError('Sorry, this user has been locked out.');
  });
});
