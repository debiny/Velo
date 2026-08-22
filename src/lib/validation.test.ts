import { describe, expect, it } from 'vitest';
import { isValidCpf } from './validation';

describe('isValidCpf', () => {
  it('retorna true para CPFs válidos com pontuação', () => {
    // CPFs válidos com matemática de dígitos verificadores correta
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.444.777-35')).toBe(true);
  });

  it('retorna true para CPFs válidos contendo apenas números', () => {
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('11144477735')).toBe(true);
  });

  it('retorna false para sequências de dígitos idênticos', () => {
    expect(isValidCpf('000.000.000-00')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('999.999.999-99')).toBe(false);
  });

  it('retorna false para CPFs com dígitos verificadores incorretos', () => {
    expect(isValidCpf('123.456.789-00')).toBe(false);
    expect(isValidCpf('529.982.247-99')).toBe(false);
  });

  it('retorna false para valores com tamanho ou formato inválido', () => {
    expect(isValidCpf('')).toBe(false);
    expect(isValidCpf('123.456')).toBe(false);
    expect(isValidCpf('123.456.789-001')).toBe(false);
    expect(isValidCpf('abc.def.ghi-jk')).toBe(false);
  });
});
