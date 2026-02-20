import { test, expect } from '@playwright/test'
import { TIMEOUT } from 'dns'

///AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data

    const order= 'VLO-PKAFMV'

  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  //await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-PKAFMV')
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
  //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
  //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV')

  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

 //Assert
 //const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-PKAFMV"]') - validação usando xpath puro
 //await expect(orderCode).toBeVisible({timeout: 30_000})

 const containerPedido = page.getByRole('paragraph')
 .filter({ hasText: /^Pedido$/}) // = (/^ começa com) ($/ Termina com)Expresão regular para melhorar o criterio de filtragem
 .locator('..')//sobe para o elemento pai (a div que agrupa ambos)
 await expect(containerPedido).toContainText('order', {timeout: 10_000})

 await expect(page.getByText('APROVADO')).toBeVisible({timeout: 30_000})



})

test('deve exibir mensagem quando o pedido não é encontrado',async ({page})=>{
    
const order = 'VLO-abc123'

await page.goto('http://localhost:5173/')
await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

await page.getByRole('link', { name: 'Consultar Pedido' }).click()
await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
await page.getByRole('button', { name: 'Buscar Pedido' }).click()

//await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente');
//await expect(page.locator('#root')).toContainText('Pedido não encontrado')

// const title = page.getByRole('heading', {name: 'Pedido não encontrado'}, )
// await expect(title).toBeVisible()
  
//buscando o elemnento atraves do xptah
//const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]') 

//buscando o elemento atraves do local locator de modo mais simples
// const message = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'})
// await expect(message).toBeVisible()

//buscando o elemento usando o Assert snapshot do playwright
test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  });
}

)