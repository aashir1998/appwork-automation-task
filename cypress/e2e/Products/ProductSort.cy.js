import Login from '../../support/Login';
import Products from '../../support/Products';

describe('ProductSort', { tags: ['@Regression'] }, () => {
  it('Sorts products by price from low to high', () => {
    const login = new Login();
    const products = new Products();

    login.loginUsingUi('standard');
    products.sortProductsByPriceLowToHigh();
    products.assertPricesSortedAscending();
  });
});
