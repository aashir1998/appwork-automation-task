import LoginPage from '../../support/pages/login.page';

describe('User Login', { tags: ['@Smoke', '@Regression'] }, () => {
  const login = new LoginPage();

  it('Logs in successfully with a valid standard user', () => {
    login.loginUsingUi('standard');
    login.assertLoginSuccess();
  });

  it('Rejects login for a locked out user', () => {
    login.loginUsingUi('lockedOut');
    login.assertLoginError('lockedOut');
  });
});
