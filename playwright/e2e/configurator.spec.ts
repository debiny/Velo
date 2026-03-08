import { test, expect } from '@playwright/test'

test.describe('Configuração do veículo', () => {

  test('deve atualizar a imagem e manter o preço base ao alterar a cor exterior', async ({ page }) => {
    const car = page.locator('img[alt^="Velô Sprint"]')

    // Arrange
    await page.goto('/configure')

    // checkpoint: estado inicial
    await expect(page.getByText('Preço de Venda')).toBeVisible()
    await expect(page.getByText('R$ 40.000,00')).toBeVisible()

    // Act: alterar apenas a cor
    await page.getByRole('button', { name: 'Midnight Black' }).click()

    // Assert: preço permanece o mesmo e imagem é atualizada
    await expect(page.getByText('R$ 40.000,00')).toBeVisible()

    await expect(car).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png')

  })

  test('deve atualizar o preço e a imagem do veículo ao alterar o tipo de roda', async ({ page }) => {

    const car = page.locator('img[alt^="Velô Sprint"]')

    // Arrange
    await page.goto('/configure')

    // checkpoint: estado inicial
    await expect(page.getByText('Preço de Venda')).toBeVisible()
    await expect(page.getByText('R$ 40.000,00')).toBeVisible()

    // Act 1: selecionar rodas Sport Wheels
    await page.getByRole('button', { name: /Sport Wheels/i }).click()

    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-sport-wheels.png')

    // Assert 1: preço atualizado com acréscimo de R$ 2.000,00
    await expect(page.getByText('R$ 42.000,00')).toBeVisible()

    // Act 2: voltar para rodas Aero Wheels
    await page.getByRole('button', { name: /Aero Wheels/i }).click()


    // Assert 2: preço volta para o valor base
    await expect(page.getByText('R$ 40.000,00')).toBeVisible()

    // Imagem volta para Glacier Blue com Aero Wheels
    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-aero-wheels.png')
  })
})

