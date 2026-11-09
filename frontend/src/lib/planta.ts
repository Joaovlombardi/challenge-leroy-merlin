/**
 * Planta esquemática usada por todas as lojas.
 *
 * O backend só informa o corredor do produto em texto, como "C4":
 * - a LETRA (A a F) é o corredor, desenhado como uma coluna;
 * - o NÚMERO (1 a 5) é o trecho dentro do corredor, contado a partir da entrada.
 *
 * As medidas abaixo estão nas unidades do desenho SVG (viewBox 320 x 340).
 */

export const LETRAS_CORREDORES = ['A', 'B', 'C', 'D', 'E', 'F']
export const QUANTIDADE_TRECHOS = 5

/** Prateleiras ocupam de TOPO_PRATELEIRAS até BASE_PRATELEIRAS. */
export const TOPO_PRATELEIRAS = 36
export const BASE_PRATELEIRAS = 246
export const ALTURA_TRECHO = (BASE_PRATELEIRAS - TOPO_PRATELEIRAS) / QUANTIDADE_TRECHOS

/** Altura do corredor principal, que corta a loja perto da entrada. */
export const Y_CORREDOR_PRINCIPAL = 268

/** Ponto da porta de entrada, no meio da parede de baixo. */
export const ENTRADA = { x: 160, y: 308 }

/** Posição horizontal (x) do meio de cada corredor: A = 40, B = 88, ... F = 280. */
export function xDoCorredor(letra: string): number {
  return 40 + LETRAS_CORREDORES.indexOf(letra) * 48
}

/** Posição vertical (y) do meio de um trecho: o trecho 1 fica mais perto da entrada. */
export function yDoTrecho(trecho: number): number {
  return BASE_PRATELEIRAS - (trecho - 0.5) * ALTURA_TRECHO
}

/**
 * Converte o corredor de um produto ("C4") em letra, trecho e coordenadas.
 * Devolve null quando o código não segue o padrão letra A–F + número 1–5.
 */
export function localizarCorredor(corredor: string) {
  const codigo = corredor.trim().toUpperCase()
  const letra = codigo[0]
  const trecho = Number(codigo.slice(1))

  const letraValida = LETRAS_CORREDORES.includes(letra)
  const trechoValido = Number.isInteger(trecho) && trecho >= 1 && trecho <= QUANTIDADE_TRECHOS
  if (!letraValida || !trechoValido) return null

  return { letra, trecho, x: xDoCorredor(letra), y: yDoTrecho(trecho) }
}
