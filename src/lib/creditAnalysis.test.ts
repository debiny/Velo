import { describe, expect, it } from 'vitest';
import { evaluateCreditApproval } from './creditAnalysis';

describe('evaluateCreditApproval', () => {
  const totalPrice = 40000;

  describe('Regra 1: Entrada Alta (>= 50%)', () => {
    it('aprova o crédito quando a entrada for >= 50% mesmo com score baixo (< 700)', () => {
      const result = evaluateCreditApproval({
        score: 400,
        entryValue: 20000, // 50% do total
        totalPrice,
      });
      expect(result).toBe('APROVADO');
    });

    it('aprova o crédito quando a entrada for maior que 50% e score médio', () => {
      const result = evaluateCreditApproval({
        score: 650,
        entryValue: 25000, // 62.5% do total
        totalPrice,
      });
      expect(result).toBe('APROVADO');
    });
  });

  describe('Regra 2: Score Alto (> 700)', () => {
    it('aprova o crédito quando o score for maior que 700, independente da entrada', () => {
      const resultNoEntry = evaluateCreditApproval({
        score: 750,
        entryValue: 0,
        totalPrice,
      });
      expect(resultNoEntry).toBe('APROVADO');

      const resultLowEntry = evaluateCreditApproval({
        score: 850,
        entryValue: 5000,
        totalPrice,
      });
      expect(resultLowEntry).toBe('APROVADO');
    });
  });

  describe('Regra 3: Score Médio (501 a 700 com entrada < 50%)', () => {
    it('retorna EM_ANALISE para score entre 501 e 700 sem entrada suficiente', () => {
      const result = evaluateCreditApproval({
        score: 600,
        entryValue: 10000, // 25% do total
        totalPrice,
      });
      expect(result).toBe('EM_ANALISE');
    });

    it('retorna EM_ANALISE no limite superior do score médio (700) com entrada < 50%', () => {
      const result = evaluateCreditApproval({
        score: 700,
        entryValue: 19999, // < 50%
        totalPrice,
      });
      expect(result).toBe('EM_ANALISE');
    });
  });

  describe('Regra 4: Score Baixo (<= 500 com entrada < 50%)', () => {
    it('reprova o crédito quando o score for <= 500 sem entrada >= 50%', () => {
      const result = evaluateCreditApproval({
        score: 300,
        entryValue: 0,
        totalPrice,
      });
      expect(result).toBe('REPROVADO');
    });

    it('reprova no limite do score baixo (500) com entrada quase suficiente (49.9%)', () => {
      const result = evaluateCreditApproval({
        score: 500,
        entryValue: 19900,
        totalPrice,
      });
      expect(result).toBe('REPROVADO');
    });
  });

  describe('Casos de borda', () => {
    it('retorna REPROVADO se o preço total for 0 ou negativo', () => {
      expect(evaluateCreditApproval({ score: 800, entryValue: 0, totalPrice: 0 })).toBe('REPROVADO');
      expect(evaluateCreditApproval({ score: 800, entryValue: 0, totalPrice: -1000 })).toBe('REPROVADO');
    });
  });
});
