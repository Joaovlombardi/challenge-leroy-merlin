import type { Loja } from '@/types/api'

/**
 * Loja em que o cliente disse estar. Fica no navegador para que, ao voltar ao
 * site, ele não precise escolher de novo. A Pessoa 2 pode ler a mesma chave.
 */
export const CHAVE_LOJA_ATUAL = 'leroy-guia:loja-atual'

export function lerLojaAtual(): Loja | null {
  try {
    const bruto = localStorage.getItem(CHAVE_LOJA_ATUAL)
    return bruto ? (JSON.parse(bruto) as Loja) : null
  } catch {
    return null
  }
}

export function salvarLojaAtual(loja: Loja): void {
  try {
    localStorage.setItem(CHAVE_LOJA_ATUAL, JSON.stringify(loja))
  } catch {
    // armazenamento indisponível (modo privado, por exemplo): segue sem salvar
  }
}

export function limparLojaAtual(): void {
  try {
    localStorage.removeItem(CHAVE_LOJA_ATUAL)
  } catch {
    // idem
  }
}
