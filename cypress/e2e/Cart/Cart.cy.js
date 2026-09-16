import Login from '../../support/Login';
import Cart from '../../support/Cart';

describe('Cart', { tags: ['@Smoke'] }, () => {
  it('Adds a product to the cart and verifies it in the cart', () => {
    const login = new Login();
    const cart = new Cart();
    const productName = 'Sauce Labs Backpack';

    login.loginUsingUi('standard');
    cart.addProductToCartByName(productName);
    cart.assertCartBadgeCount(1);

    cart.openCart();
    cart.assertCartContainsProduct(productName);
  });
});
