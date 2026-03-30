import { Page, expect } from '@playwright/test';

export function createCheckoutActions(page: Page) {
  return {


    async validateRedirectToCheckout() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
    }
  };
}
