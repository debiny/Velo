import { Page, expect } from '@playwright/test';

export function createConfiguratorActions(page: Page) {


  return {

    async open() {
      await page.goto('/configure');
    },

    async selectColor(colorName: string) {
      await page.getByRole('button', { name: colorName }).click();
    },

    async selectWheels(wheelsName: string | RegExp) {
      await page.getByRole('button', { name: wheelsName }).click();
    },

    async expectPrice(price: string) {
      const priceElement = page.getByTestId('total-price');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toHaveText(price)
    },

    async validateCarImage(expectedSrc: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]');
      await expect(carImage).toHaveAttribute('src', expectedSrc);
    },

    async toggleOptional(optionalName: string | RegExp) {
      await page.getByRole('checkbox', { name: optionalName }).click();
    },

    async proceedToCheckout() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click();
    }
  };
}
