export type CreditStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export interface CreditAnalysisParams {
  score: number;
  entryValue: number;
  totalPrice: number;
}

/**
 * Avalia o status do financiamento com base no score de crédito e no valor de entrada.
 * 
 * Regras de Decisão (em ordem de precedência):
 * 1. Entrada Alta: Se a entrada for >= 50% do total e score < 700 -> APROVADO
 * 2. Score Alto: Se score > 700 -> APROVADO
 * 3. Score Médio: Se score entre 501 e 700 (e entrada < 50%) -> EM_ANALISE
 * 4. Score Baixo: Se score <= 500 (e entrada < 50%) -> REPROVADO
 */
export function evaluateCreditApproval({ score, entryValue, totalPrice }: CreditAnalysisParams): CreditStatus {
  if (totalPrice <= 0) {
    return 'REPROVADO';
  }

  const entryPercentage = entryValue / totalPrice;

  // 1️⃣ Regra da Entrada Alta: SE (Entrada >= 50% do Total) E (Score < 700) → APROVADO
  if (entryPercentage >= 0.5 && score < 700) {
    return 'APROVADO';
  }
  // 2️⃣ Score Alto: SE Score > 700 → APROVADO
  if (score > 700) {
    return 'APROVADO';
  }
  // 3️⃣ Score Médio: SE Score entre 501 e 700 → EM_ANALISE
  if (score >= 501 && score <= 700) {
    return 'EM_ANALISE';
  }
  // 4️⃣ Score Baixo: SE Score <= 500 → REPROVADO
  return 'REPROVADO';
}
