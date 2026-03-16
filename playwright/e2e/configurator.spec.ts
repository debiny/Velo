import { test, expect } from '../support/fixtures'

test.describe('Configuração do veículo', () => {

  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao alterar a cor exterior', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    // Act: alterar apenas a cor
    await app.configurator.selectColor('Midnight Black')

    // Assert: preço permanece o mesmo e imagem é atualizada
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.validateCarImage('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço e a imagem do veículo ao alterar o tipo de roda', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    // Act 1: selecionar rodas Sport Wheels
    await app.configurator.selectWheels(/Sport Wheels/i)

    // Assert 1: preço atualizado com acréscimo de R$ 2.000,00
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.validateCarImage('/src/assets/glacier-blue-sport-wheels.png')

    // Act 2: voltar para rodas Aero Wheels
    await app.configurator.selectWheels(/Aero Wheels/i)

    // Assert 2: preço volta para o valor base
    await app.configurator.expectPrice('R$ 40.000,00')

    // Imagem volta para Glacier Blue com Aero Wheels
    await app.configurator.validateCarImage('/src/assets/glacier-blue-aero-wheels.png')
  })
})

