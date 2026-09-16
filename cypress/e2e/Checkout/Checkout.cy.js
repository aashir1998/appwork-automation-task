import Login from '../../support/Login';
import Cart from '../../support/Cart';
import Checkout from '../../support/Checkout';

describe('Checkout', { tags: ['@Smoke', '@Regression'] }, () => {
  it('Completes checkout with a product in the cart', () => {
    const login = new Login();
    const cart = new Cart();
    const checkout = new Checkout();

    login.loginUsingUi('standard');
    cart.addProductToCartByName('Sauce Labs Backpack');
    cart.openCart();

    checkout.startCheckout();
    checkout.fillCheckoutInfoWithGeneratedData();
    checkout.completeOrder();
    checkout.assertOrderComplete();
  });
});
