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

    async expectPrice(expected: string) {
      const priceElement = page.getByTestId('total-price');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toHaveText(expected)
    },

    async validateCarImage(expectedSrc: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]');
      await expect(carImage).toHaveAttribute('src', expectedSrc);
    }
  };
}
