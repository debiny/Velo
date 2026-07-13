import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'
import testData from '../support/fixtures/orders.json' with { type: 'json' }

test.describe('Checkout', () => {



  test.describe('Validações de campos obrigatórios', () => {
    let alerts: any
    test.beforeEach(async ({ page, app }) => {
      await app.hero.clickPrimaryCta()
      await app.configurator.finishConfigurator()
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

      alerts = app.checkout.elements.alerts
    })


    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.email).toHaveText('Email inválido')
      await expect(alerts.phone).toHaveText('Telefone inválido')
      await expect(alerts.document).toHaveText('CPF inválido')
      await expect(alerts.store).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {

      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'papito@teste.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro para CPF inválido', async ({ app }) => {

      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@test.com',
        document: '00000014199',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.document).toHaveText('CPF inválido')
    })

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {

      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@test.com',
        document: '00000014199',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.terms).not.toBeChecked()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

  })

})

test.describe('Pagamento e confirmação', () => {

  test.beforeEach(async ({ app }) => {
    await app.hero.clickPrimaryCta()

  })

  test('CT05 - deve criar pedido à vista com status APROVADO', async ({ app }) => {
    const order = testData.e2e_aprovado

    await deleteOrderByEmail(order.customer.email)

    // Arrange
    await app.configurator.finishConfigurator()

    // Act
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.expectSummaryTotal('R$ 40.000,00')
    await app.checkout.expectAvistaTotal('R$ 40.000,00')
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Aprovado')


  })

  test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ app }) => {
    const order = testData.financiado_aprovado

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(710)


    // Arrange
    await app.configurator.finishConfigurator()
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)

    // Act
    await app.checkout.selectPaymentMethod(order.payment_method)
    // await app.checkout.expectSummaryTotal(order.total_price)
    //await app.checkout.expectFinanciamentoTotal(order.total_price_financiado)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Aprovado')


  })

  test('deve cair em análise quando o score for entre 501 e 700 no financiamento.', async ({ app }) => {
    const order = testData.financiado_analise

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(600)

    // Arrange
    await app.configurator.finishConfigurator()
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)

    // Act
    await app.checkout.selectPaymentMethod(order.payment_method)
    // await app.checkout.expectSummaryTotal(order.total_price)
    //await app.checkout.expectFinanciamentoTotal(order.total_price_financiado)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('em Análise')


  })

  test('CT08 - deve reprovar o crédito quando o score for menor ou igual a 500 no financiamento sem entrada', async ({ app }) => {
    const order = testData.financiado_reprovado

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(400)


    // Arrange
    await app.configurator.finishConfigurator()
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)

    // Act 
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Reprovado')


  })

  test('CT08 - deve reprovar o crédito quando o score for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ app }) => {
    const order = testData.financiado_reprovado_entrada_parcial

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(410)


    // Arrange
    await app.configurator.finishConfigurator()
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)

    // Act
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.fillEntryValue(order.entry_value)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Reprovado')


  })

  test(' deve aprovar o crédito quando o score for menor ou igual a 500 no financiamento com entrada igual a 50%', async ({ app }) => {
    const order = testData.financiado_aprovado_entrada_igual_50

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(450)


    // Arrange
    await app.configurator.finishConfigurator()

    // Act
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.fillEntryValue(order.entry_value)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Aprovado')



  })

  test(' deve aprovar o crédito quando o score for menor ou igual a 500 no financiamento com entrada maior que 50%', async ({ app }) => {
    const order = testData.financiado_reprovado_entrada_maior_50

    await deleteOrderByEmail(order.customer.email)

    await app.mock.mockCreditAnalysis(350)


    // Arrange
    await app.configurator.finishConfigurator()
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)

    // Act
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.fillEntryValue(order.entry_value)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await app.checkout.expectResult('Aprovado')



  })
})
