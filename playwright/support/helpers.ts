export function gerarCodigoPedido() {
    const prefixo = 'VLO-';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sufixo = '';
  
    // Gera 6 letras aleatórias
    for (let i = 0; i < 6; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      sufixo += caracteres.charAt(indiceAleatorio);
    }
  
    return prefixo + sufixo;
  }
