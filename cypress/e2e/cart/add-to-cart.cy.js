import LoginPage from '../../support/pages/login.page';
import ProductsPage from '../../support/pages/products.page';
import CartPage from '../../support/pages/cart.page';

describe('Add to Cart', { tags: ['@Smoke'] }, () => {
  it('Adds a product to the cart and verifies it in the cart', () => {
    const login = new LoginPage();
    const products = new ProductsPage();
    const cart = new CartPage();
    const productName = 'Sauce Labs Backpack';

    login.loginUsingUi('standard');
    login.assertLoginSuccess();

    products.addProductToCart(productName);
    products.assertCartBadgeCount(1);
    products.openCart();

    cart.assertContainsProduct(productName);
  });
});
