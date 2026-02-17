import { test, expect } from '@playwright/test'

///AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  //await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-PKAFMV')
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-PKAFMV');
  //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
  //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV');

  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 30_000})
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-PKAFMV')

  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')

})