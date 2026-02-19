import { test, expect } from '@playwright/test'
import { TIMEOUT } from 'dns'

///AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  //await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-PKAFMV')
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-PKAFMV')
  //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
  //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV')

  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

 //Assert
 //const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-PKAFMV"]') - validação usando xpath puro
 //await expect(orderCode).toBeVisible({timeout: 30_000})

 const containerPedido = page.getByRole('paragraph')
 .filter({ hasText: /^Pedido$/}) // = (/^ começa com) ($/ Termina com)Expresão regular para melhorar o criterio de filtragem
 .locator('..')//sobe para o elemento pai (a div que agrupa ambos)
 await expect(containerPedido).toContainText('VLO-PKAFMV', {timeout: 10_000})

 await expect(page.getByText('APROVADO')).toBeVisible({timeout: 30_000})



})