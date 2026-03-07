import { test, expect } from '../support/fixtures'
import { gerarCodigoPedido } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'



///AAA - Arrange, Act, Assert

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ app }) => {
    //roda antes de cada teste
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

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
    await app.orderLookup.searchOrder(order.number)

    //Assert
    await app.orderLookup.validateOrderDetails(order)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

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
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido em analise', async ({ app }) => {

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
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = gerarCodigoPedido()

    //Act
    await app.orderLookup.searchOrder(order)

    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando em qualquer formato não é encontrado', async ({ app }) => {

    const orderCode = "XYZ-999-invalido"

    await app.orderLookup.searchOrder(orderCode)
   
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão desabilitado com campo vazio ou apenas espaços', async({ app, page }) => {
    const button = app.orderLookup.elements.serachButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('    ')
    await expect(button).toBeDisabled()
  })

})




