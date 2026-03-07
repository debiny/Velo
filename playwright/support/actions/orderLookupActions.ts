import { Page, expect } from '@playwright/test';

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export type OrderDetails = {
  number: string;
  status: OrderStatus;
  color: string;
  wheels: string;
  customer: {
    name: string;
    email: string;
  };
  payment: string;
};

export function createOrderLookupActions(page: Page) {

  const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' })
  const serachButton = page.getByRole('button', { name: 'Buscar Pedido' })

  return {

    elements: {
      orderInput,
      serachButton

    },
    async open() {
      await page.goto('/');
      const title = page.getByTestId('hero-section').getByRole('heading');
      await expect(title).toContainText('Velô Sprint');
      await page.getByRole('link', { name: 'Consultar Pedido' }).click();
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    },

    async searchOrder(code: string) {
      await orderInput.fill(code);
      await serachButton.click();
    },

    async validateOrderDetails(order: OrderDetails) {
      const card = page.getByTestId(`order-result-${order.number}`);
      await expect(card).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
`);
    },

    async validateStatusBadge(status: OrderStatus) {
      const statusBadge = page.getByRole('status').filter({ hasText: status });

      if (status === 'APROVADO') {
        await expect(statusBadge).toHaveClass(/bg-green-100/);
        await expect(statusBadge).toHaveClass(/text-green-700/);
        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide lucide-circle-check-big/);
        return;
      }

      if (status === 'REPROVADO') {
        await expect(statusBadge).toHaveClass(/bg-red-100/);
        await expect(statusBadge).toHaveClass(/text-red-700/);
        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide lucide-circle-x/);
        return;
      }

      if (status === 'EM_ANALISE') {
        await expect(statusBadge).toHaveClass(/bg-amber-100/);
        await expect(statusBadge).toHaveClass(/text-amber-700/);
        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide-clock-icon/);
      }
    },

    async validateOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
    },
  };
}

