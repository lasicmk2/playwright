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

const skuValue = process.env.sku as string;


export class ShopPage {

    readonly page: Page;
    readonly productBySku: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productBySku = page.locator('div[data-sku="'+skuValue+'"]');
    }

    async clickOnTheProduct() {
        await this.productBySku.click();
    }
}