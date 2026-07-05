import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'
import testData from '../support/fixtures/orders.json' with { type: 'json' }

test.describe('Checkout', () => {



  test.describe('Validações de campos obrigatórios', () => {
    let alerts: any
    test.beforeEach(async ({ page, app }) => {
      await page.goto('/order')
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

  test('CT05 - deve criar pedido à vista com status APROVADO', async ({ app, page }) => {
    const order = testData.e2e_aprovado

    await deleteOrderByEmail(order.customer.email)

    // Arrange: landing → configurador → checkout
    await page.goto('/')
    await page.getByTestId('hero-cta-primary').click()
    await app.configurator.finishConfigurator()

    // Act: preenche formulário
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)
    await app.checkout.selectPaymentMethod(order.payment_method)
    await app.checkout.expectSummaryTotal('R$ 40.000,00')
    await app.checkout.expectAvistaTotal('R$ 40.000,00')
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await expect(page).toHaveURL(/\/success/)
    await app.success.expectOrderApproved()
    await app.success.expectOrderNumberVisible()


  })

  test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ app, page }) => {
    const order = testData.financiado_aprovado

    await deleteOrderByEmail(order.customer.email)

    //cria uma rota de interceptação de requisições
    await page.route('**/functions/v1/credit-analysis', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'DONE', score: 710 }) })
    })

    // Arrange: landing → configurador → checkout
    await page.goto('/')
    await page.getByTestId('hero-cta-primary').click()
    await app.configurator.finishConfigurator()

    // Act: preenche formulário
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)
    await app.checkout.selectPaymentMethod(order.payment_method)
    // await app.checkout.expectSummaryTotal(order.total_price)
    //await app.checkout.expectFinanciamentoTotal(order.total_price_financiado)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await expect(page).toHaveURL(/\/success/)
    await app.success.expectOrderApproved()
    await app.success.expectOrderNumberVisible()


  })

  test('deve cair em análise quando o score for entre 400 e 700 no financiamento.', async ({ app, page }) => {
    const order = testData.financiado_analise

    await deleteOrderByEmail(order.customer.email)

    await page.route('**/functions/v1/credit-analysis', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'DONE', score: 600 }) })
    })

    // Arrange: landing → configurador → checkout
    await page.goto('/')
    await page.getByTestId('hero-cta-primary').click()
    await app.configurator.finishConfigurator()

    // Act: preenche formulário
    await app.checkout.fillCustomerlData(order.customer)
    await app.checkout.selectStore(order.store)
    await app.checkout.selectPaymentMethod(order.payment_method)
    // await app.checkout.expectSummaryTotal(order.total_price)
    //await app.checkout.expectFinanciamentoTotal(order.total_price_financiado)
    await app.checkout.acceptTerms()
    await app.checkout.submit()

    // Assert: página de confirmação
    await expect(page).toHaveURL(/\/success/)
    await app.success.expectOrderInAnalysis()
    await app.success.expectOrderNumberVisible()


  })
})