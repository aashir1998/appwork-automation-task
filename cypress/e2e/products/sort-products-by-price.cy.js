import LoginPage from '../../support/pages/login.page';
import ProductsPage from '../../support/pages/products.page';

describe('Sort Products by Price', { tags: ['@Regression'] }, () => {
  it('Sorts products by price from low to high', () => {
    const login = new LoginPage();
    const products = new ProductsPage();

    login.loginUsingUi('standard');
    login.assertLoginSuccess();

    products.sortByPriceLowToHigh();
    products.assertPricesSortedAscending();
  });
});
