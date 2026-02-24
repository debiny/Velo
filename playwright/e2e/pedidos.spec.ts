import { test, expect } from '@playwright/test'
import { gerarCodigoPedido } from '../suport/helpers'
import { OrderLockupPage } from '../suport/pages/OrderLockupPage' 



///AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    //roda antes de cada teste
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })


  test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data

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


    //Act
    const orderLockupPage = new OrderLockupPage(page)

    await orderLockupPage.seachOrder(order.number)

    //Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
          `, { timeout: 30_000 });

    const statusBadge = page.getByRole('status').filter({ hasText: order.status }) //obtem o badge pelo valor do status

    // as barras são o Contain
    await expect(statusBadge).toHaveClass(/bg-green-100/) //verfica se o fundo é verde claro
    await expect(statusBadge).toHaveClass(/text-green-700/) //veifica a cor do texto

    const statusIcon = statusBadge.locator('svg') //verifica o icone 
    expect(statusIcon).toHaveClass(/lucide-circle-check-big/)

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


    //Act
    const orderLockupPage = new OrderLockupPage(page)

    await orderLockupPage.seachOrder(order.number)

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
      `, { timeout: 30_000 });

      const statusBadge = page.getByRole('status').filter({ hasText: order.status }) //obtem o badge pelo valor do status

      // as barras são o Contain
      await expect(statusBadge).toHaveClass(/bg-red-100/) //verfica se o fundo é verde claro
      await expect(statusBadge).toHaveClass(/text-red-700/) //veifica a cor do texto
  
      const statusIcon = statusBadge.locator('svg') //verifica o icone 
      expect(statusIcon).toHaveClass(/lucide lucide-circle-x/)

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
     const orderLockupPage = new OrderLockupPage(page)

     await orderLockupPage.seachOrder(order.number)
     
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
      `,);

      const statusBadge = page.getByRole('status').filter({ hasText: order.status }) //obtem o badge pelo valor do status

      // as barras são o Contain
      await expect(statusBadge).toHaveClass(/bg-amber-100/) //verfica se o fundo é verde claro
      await expect(statusBadge).toHaveClass(/text-amber-700/) //veifica a cor do texto
  
      const statusIcon = statusBadge.locator('svg') //verifica o icone 
      expect(statusIcon).toHaveClass(/lucide-clock-icon/)

  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()

    //Act
    const orderLockupPage = new OrderLockupPage(page)

    await orderLockupPage.seachOrder(order
      
    )
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
          - img
          - heading "Pedido não encontrado" [level=3]
          - paragraph: Verifique o número do pedido e tente novamente
          `)
  })


})




