import { test, expect } from '@playwright/test'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'
import { LandingPage } from '../support/pages/LandingPage'
import { Navbar } from '../support/pages/Navbar'



///AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {
    //roda antes de cada teste
    const landingPage = new LandingPage(page)
    await landingPage.goto()
    const navbar = new Navbar(page)
    await navbar.goToOrderLookup()
    //await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data

    const order: OrderDetails = {
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
    await orderLockupPage.validateOrderDetails(order)

    //await orderLockupPage.validateStatusBadge (order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    //Test Data

    //onst order = 'VLO-5NCPNL'
    const order: OrderDetails = {
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

    await orderLockupPage.validateOrderDetails(order)


    const statusBadge = page.getByRole('status').filter({ hasText: order.status }) //obtem o badge pelo valor do status

    // as barras são o Contain
    await expect(statusBadge).toHaveClass(/bg-red-100/) //verifica se o fundo é vermelho claro
    await expect(statusBadge).toHaveClass(/text-red-700/) //verifica a cor do texto

    const statusIcon = statusBadge.locator('svg') //verifica o icone 
    expect(statusIcon).toHaveClass(/lucide lucide-circle-x/)

  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    //Test Data

    //onst order = 'VLO-5NCPNL'
    const order: OrderDetails = {
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

    await orderLockupPage.validateOrderDetails(order)


    const statusBadge = page.getByRole('status').filter({ hasText: order.status }) //obtem o badge pelo valor do status

    // as barras são o Contain
    await expect(statusBadge).toHaveClass(/bg-amber-100/) //verifica se o fundo é âmbar claro
    await expect(statusBadge).toHaveClass(/text-amber-700/) //verifica a cor do texto

    const statusIcon = statusBadge.locator('svg') //verifica o icone 
    expect(statusIcon).toHaveClass(/lucide-clock-icon/)

  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()

    //Act
    const orderLockupPage = new OrderLockupPage(page)

    await orderLockupPage.seachOrder(order)

    await orderLockupPage.validateOrderNotFound()
  })

  test('deve exibir mensagem quando em qualquer formato não é encontrado', async ({ page }) => {

    const orderCode = "XYZ-999-invalido"
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.seachOrder(orderCode)
   
    await orderLockupPage.validateOrderNotFound()
  })

})




