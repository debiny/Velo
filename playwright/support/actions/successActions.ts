import { Page, expect } from '@playwright/test'

export function createSuccessActions(page: Page) {
  return {
    async expectOrderApproved() {
      await expect(page.getByTestId('success-status')).toHaveText('Pedido Aprovado!')
    },

    async expectOrderAnalized() {
      await expect(page.getByTestId('success-status')).toHaveText('Pedido Em Análise!')
    },

    async expectOrderInAnalysis() {
      await expect(page.getByTestId('success-status')).toHaveText('Pedido em Análise!')
    },

    async expectOrderRejected() {
      await expect(page.getByTestId('success-status')).toHaveText('Pedido Reprovado!')
    },

    async expectOrderNumberVisible() {
      await expect(page.getByTestId('order-id')).not.toBeEmpty()
    },
  }
}
