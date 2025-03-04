import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
import { HomePage } from '../pages/home.page';
import { ShopPage } from '../pages/shop.page';
import { ProductPage } from '../pages/product.page';


if(process.env.ENV){
  dotenv.config({
    path: './env/.env.'+process.env.ENV,
  })
} else {
  dotenv.config({
    path: './env/.env.uk',
  })
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const baseUrl = process.env.BASEURL as string;
const productTitleText = process.env.productTitle as string;
const emptyCartText = process.env.emptyCartText as string;

test.beforeEach(async ({ page }, testInfo) => {
  const homePage = new HomePage(page);

  await page.setViewportSize({
    width: 1640,
    height: 1200,
  });
  
  await page.goto(baseUrl);
  
  homePage.acceptCookies();
  homePage.confirmAge();
  await page.waitForLoadState('load');
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
});


/*
Visit the Ploom website: Ploom Website: Buy Heated Tobacco Products, Devices and Kits.
Click on "Shop".
Open the product page by SKU (find the element with data-sku="<>" in the DOM. As a test, you can use 'ploom-x-advanced').
Add the product to the cart.
Check your basket count.
Open the basket.
Check if the product is in the basket.
*/

test('Add a product to the cart.', async ({ page }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const productPage = new ProductPage(page);

  await homePage.gotoShop();
  await shopPage.clickOnTheProduct();
  await productPage.addToCart();
  await productPage.checkIfCheckoutButtonAppeared();
  await expect(productPage.number1SmallCartIcon).toHaveText("1");
  await expect(productPage.elementsInCart).toHaveCount(1);
  await productPage.checkoutBtnClick();
  await expect(productPage.productTitle).toHaveText(productTitleText);
});


/*
Open the cart.
Remove the product from the cart.
Verify that the product is no longer in the cart.
Check if the basket count is updated correctly.
*/
test('Remove a product from the cart.', async ({ page }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const productPage = new ProductPage(page);
  

  await homePage.gotoShop();
  await shopPage.clickOnTheProduct();
  await productPage.addToCart();
  await productPage.checkIfCheckoutButtonAppeared();

  await expect(productPage.elementsInCart).toHaveCount(1);
  await productPage.removeFromCartClick();
  await expect(productPage.emptyCartCounter).toHaveText(emptyCartText);  
});


test("Check all links and pictures on the page", async ({ page }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const productPage = new ProductPage(page);

  await homePage.gotoShop();
  await shopPage.clickOnTheProduct();
  await productPage.checkoutBtn.isVisible();
  await page.waitForLoadState('load');

  const links = await page.locator("a[href]").all(); // get all links

  for (const link of links) {
    let href = await link.getAttribute("href");

    if (href) {
      // If link is relative, add baseURL
      if (href.startsWith("/")) {
        href = baseUrl + href;
      }
      if (!href.startsWith("tel")) { //exclude phone number
        //console.log(href);
        const response = await page.request.get(href);
        console.log(href + " : " + response.status());
        expect(response.status(), `Err for link: ${href}`).toBe(200);
      }
    }
  }

  expect(await productPage.imagesLocator.count()).toBeGreaterThan(0);
  const productPictures = await productPage.imagesLocator.all();
  
  for (let picture of productPictures) {
      console.log(picture)
      await expect(picture).toBeVisible();
  }
});

