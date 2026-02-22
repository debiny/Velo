import { test, expect } from '@playwright/test'
import { gerarCodigoPedido } from '../suport/helpers'
import { STATUS_CODES } from 'http'



///AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  // test.beforeAll(async () => {
  //     //roda uma vez antes de cada teste
  // })

  test.beforeEach(async ({ page }) => {
    //roda antes de cada teste
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  // test.afterEach(async () => {
  //     //roda depois de cada teste
  // })

  // test.afterAll(async () => {
  //     //roda uma vez depois de cada teste
  // })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data

    //const order = 'VLO-PKAFMV'
    const order = {
      number: 'VLO-PKAFMV',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'teste1 teste',
        email: 'teste@teste.com.br'
      },
      payment: 'À Vista'


    }


    //Arrange


    //Act
    //await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-PKAFMV')
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV')

    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    //const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-PKAFMV"]') - validação usando xpath puro
    //await expect(orderCode).toBeVisible({timeout: 30_000})

    // const containerPedido = page.getByRole('paragraph')
    //     .filter({ hasText: /^Pedido$/ }) // = (/^ começa com) ($/ Termina com)Expresão regular para melhorar o criterio de filtragem
    //     .locator('..')//sobe para o elemento pai (a div que agrupa ambos)
    // await expect(containerPedido).toContainText(order, { timeout: 10_000 })

    // await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 30_000 })

    //validação com snapshot
    //` back tik - permite customizar expresoes reguralres e interpolar valores
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
          - img
          - paragraph: Pedido
          - paragraph: ${order.number}
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
          `, { timeout: 30_000 });

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    //Test Data

    //onst order = 'VLO-5NCPNL'
    const order = {
      number: 'VLO-5NCPNL',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com'
      },
      payment: 'À Vista'


    }


    //Arrange


    //Act
    //await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-PKAFMV')
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV')

    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    //const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-PKAFMV"]') - validação usando xpath puro
    //await expect(orderCode).toBeVisible({timeout: 30_000})

    // const containerPedido = page.getByRole('paragraph')
    //     .filter({ hasText: /^Pedido$/ }) // = (/^ começa com) ($/ Termina com)Expresão regular para melhorar o criterio de filtragem
    //     .locator('..')//sobe para o elemento pai (a div que agrupa ambos)
    // await expect(containerPedido).toContainText(order, { timeout: 10_000 })

    // await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 30_000 })

    //validação com snapshot
    //` back tik - permite customizar expresoes reguralres e interpolar valores
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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
      `, { timeout: 30_000 });

  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    //Test Data

    //onst order = 'VLO-5NCPNL'
    const order = {
      number: 'VLO-EYYX6A',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Joao sa Silva',
        email: 'joao@velo.dev'
      },
      payment: 'À Vista'


    }


    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    //await page.getByLabel('Número do Pedido').fill('VLO-PKAFMV');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-PKAFMV')

    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    //const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-PKAFMV"]') - validação usando xpath puro
    //await expect(orderCode).toBeVisible({timeout: 30_000})

    // const containerPedido = page.getByRole('paragraph')
    //     .filter({ hasText: /^Pedido$/ }) // = (/^ começa com) ($/ Termina com)Expresão regular para melhorar o criterio de filtragem
    //     .locator('..')//sobe para o elemento pai (a div que agrupa ambos)
    // await expect(containerPedido).toContainText(order, { timeout: 10_000 })

    // await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 30_000 })

    //validação com snapshot
    //` back tik - permite customizar expresoes reguralres e interpolar valores
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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
      `, );

  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()


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
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
          - img
          - heading "Pedido não encontrado" [level=3]
          - paragraph: Verifique o número do pedido e tente novamente
          `)
  })


})




