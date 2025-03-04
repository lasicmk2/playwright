import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from "dotenv";

if(process.env.ENV){
  dotenv.config({
    path: './env/.env.'+process.env.ENV,
  })
} else {
  dotenv.config({
    path: './env/.env.uk',
  })
}

const checkoutBtnText = process.env.checkoutBtn as string;
  
export class ProductPage {

    readonly page: Page;
    readonly addToCartBtn: Locator;
    readonly checkoutBtn: Locator;
    readonly number1SmallCartIcon: Locator;
    readonly elementsInCart: Locator;
    readonly removeFromCartBtn: Locator;
    readonly emptyCartCounter: Locator;
    readonly imagesLocator: Locator;
    readonly productTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartBtn = page.getByTestId('pdpAddToProduct');
        this.checkoutBtn = page.locator("//span[contains(text(), '"+checkoutBtnText+"')]");
        this.number1SmallCartIcon = page.locator("(//div[@data-testid='cart']/div/div)[1]");
        this.elementsInCart = page.locator('//div[@data-variant]');
        this.removeFromCartBtn = page.getByTestId('cartRemoveButton');
        this.emptyCartCounter = page.locator("//div[@data-testId='mini-cart-header']/div/div/div[contains(@class, 'CartMiniHeader-module-count-i2EyF')]");
        this.imagesLocator = page.locator("//img[@class='image__replaced']");
        this.productTitle = page.locator("(//strong[@class='ProductMiniature-module-productName-JRifI'])[2]");
    }

    async addToCart() {
        await this.addToCartBtn.click();
    }
    async checkIfCheckoutButtonAppeared(){
        await this.checkoutBtn.isEnabled();
    }
    async checkoutBtnClick(){
        await this.checkoutBtn.click();
    }
    async removeFromCartClick(){
        await this.removeFromCartBtn.click();
    }

    

}