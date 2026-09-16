import LoginPage from '../../support/pages/login.page';
import ProductsPage from '../../support/pages/products.page';
import CartPage from '../../support/pages/cart.page';
import CheckoutPage from '../../support/pages/checkout.page';

describe('Checkout Flow', { tags: ['@Smoke', '@Regression'] }, () => {
  it('Completes checkout with a product in the cart', () => {
    const login = new LoginPage();
    const products = new ProductsPage();
    const cart = new CartPage();
    const checkout = new CheckoutPage();

    login.loginUsingUi('standard');
    login.assertLoginSuccess();

    products.addProductToCart('backpack');
    products.assertCartBadgeCount(1);
    products.openCart();

    cart.assertContainsProduct('backpack');
    cart.startCheckout();

    checkout.fillInfoWithGeneratedData();
    checkout.assertOverviewStep();
    checkout.completeOrder();
    checkout.assertOrderComplete();
  });
});
