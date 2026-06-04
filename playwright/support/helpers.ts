export function gerarCodigoPedido() {
    const prefixo = 'VLO-';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sufixo = '';

    for (let i = 0; i < 6; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      sufixo += caracteres.charAt(indiceAleatorio);
    }

    return prefixo + sufixo;
  }

export const generateOrderCode = gerarCodigoPedido;
