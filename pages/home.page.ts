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

const shopBtnText = process.env.shopBtnText as string;
const adultConfirmationText = process.env.adultConfirmationText as string;

export class HomePage {

    readonly page: Page;
    readonly shopBtn: Locator;
    readonly acceptCookiesBtn: Locator;
    readonly adultConfirmBtn: Locator;

    constructor(page: Page) {
      this.page = page;
      this.shopBtn = page.locator('a.navigation__link', { hasText: shopBtnText });
      this.acceptCookiesBtn = page.locator("#onetrust-accept-btn-handler");
      this.adultConfirmBtn = page.getByText(adultConfirmationText);
    }

    async gotoShop() {
      await this.page.waitForLoadState('load');
      await this.shopBtn.click();
      this.page.mouse.move(10,40);
    }

    async acceptCookies(){
      await this.acceptCookiesBtn.click();
    }

    async confirmAge(){
      await this.adultConfirmBtn.click();
    }
}