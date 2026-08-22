/**
 * Valida se uma string é um CPF brasileiro válido.
 * 
 * Regras:
 * - Deve conter exatamente 11 dígitos numéricos após remover caracteres não numéricos.
 * - Não pode consistir em uma sequência de dígitos idênticos (ex: 111.111.111-11).
 * - Os dois dígitos verificadores (posição 10 e 11) devem corresponder ao algoritmo do módulo 11.
 */
export function isValidCpf(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calc = (len: number) =>
    digits.slice(0, len).split('').reduce((sum, d, i) => sum + Number(d) * (len + 1 - i), 0);

  const mod = (n: number) => {
    const r = (n * 10) % 11;
    return r >= 10 ? 0 : r;
  };

  return mod(calc(9)) === Number(digits[9]) && mod(calc(10)) === Number(digits[10]);
}
