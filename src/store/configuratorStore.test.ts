import { describe, expect, it } from 'vitest';
import {
  calculateInstallment,
  calculateTotalPrice,
  formatPrice,
  type CarConfiguration,
} from './configuratorStore';

const baseConfig: CarConfiguration = {
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
};

describe('calculateTotalPrice', () => {
  it('retorna o preço base sem rodas esportivas ou opcionais', () => {
    expect(calculateTotalPrice(baseConfig)).toBe(40000);
  });

  it('soma o valor das rodas esportivas', () => {
    expect(calculateTotalPrice({ ...baseConfig, wheelType: 'sport' })).toBe(42000);
  });

  it('soma o valor de cada opcional selecionado', () => {
    const config: CarConfiguration = {
      ...baseConfig,
      optionals: ['precision-park', 'flux-capacitor'],
    };
    expect(calculateTotalPrice(config)).toBe(40000 + 5500 + 5000);
  });

  it('soma rodas esportivas e opcionais juntos', () => {
    const config: CarConfiguration = {
      ...baseConfig,
      wheelType: 'sport',
      optionals: ['precision-park'],
    };
    expect(calculateTotalPrice(config)).toBe(40000 + 2000 + 5500);
  });
});

describe('calculateInstallment', () => {
  it('calcula a parcela de 12x com juros compostos de 2% ao mês', () => {
    expect(calculateInstallment(40000)).toBeCloseTo(3782.38, 2);
  });

  it('retorna 0 para um total de 0', () => {
    expect(calculateInstallment(0)).toBe(0);
  });
});

describe('formatPrice', () => {
  it('formata o valor como moeda brasileira (BRL)', () => {
    expect(formatPrice(40000)).toBe('R$ 40.000,00');
  });

  it('formata valores com centavos corretamente', () => {
    expect(formatPrice(3784.25)).toBe('R$ 3.784,25');
  });
});
