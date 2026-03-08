import { test, expect } from '@playwright/test';

test.describe('Configuração do veículo', () => {

  test('CT02 - deve atualizar o preço ao alterar rodas Sport e voltar para Aero', async ({ page }) => {
    // Arrange
    await page.goto('/configure');

    // checkpoint: estado inicial
    await expect(page.getByText('Preço de Venda')).toBeVisible();
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();

    // Act 1: alterar apenas a cor (não deve mudar o preço)
    await page.getByRole('button', { name: 'Midnight Black' }).click();

    // Assert 1: preço permanece o mesmo após trocar apenas a cor
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();

    // Act 2: selecionar rodas Sport Wheels
    await page.getByRole('button', { name: /Sport Wheels/i }).click();

    // Assert 2: preço atualizado com acréscimo de R$ 2.000,00
    await expect(page.getByText('R$ 42.000,00')).toBeVisible();

    // Act 3: voltar para rodas Aero Wheels
    await page.getByRole('button', { name: /Aero Wheels/i }).click();

    // Assert 3: preço volta para o valor base
    await expect(page.getByText('R$ 40.000,00')).toBeVisible();
  });
});

