import { Page, expect } from '@playwright/test'

export function createSuccessActions(page: Page) {
  return {
    async expectOrderApproved() {
      await expect(page.getByTestId('success-status')).toHaveText('Pedido Aprovado!')
    },

    async expectOrderNumberVisible() {
      await expect(page.getByTestId('order-id')).not.toBeEmpty()
    },
  }
}
