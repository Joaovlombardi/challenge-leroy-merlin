import type { Produto } from '@/types/api'
import { normalizar } from './texto'

export interface ResultadoComparacao {
  maisBaratoId: number | null
  maisDisponivelId: number | null
  melhorAvaliadoId: number | null
  maiorPreco: number
}

/**
 * Calcula os destaques do comparador. O "mais barato" só considera itens
 * com estoque; se nenhum tiver, considera todos. A nota só entra quando
 * pelo menos dois produtos a possuem (campo opcional no contrato).
 */
export function compararProdutos(produtos: Produto[]): ResultadoComparacao {
  if (produtos.length === 0) {
    return { maisBaratoId: null, maisDisponivelId: null, melhorAvaliadoId: null, maiorPreco: 0 }
  }

  const comEstoque = produtos.filter((produto) => produto.estoque > 0)
  const candidatosPreco = comEstoque.length > 0 ? comEstoque : produtos
  const maisBarato = candidatosPreco.reduce((menor, atual) => (atual.preco < menor.preco ? atual : menor))

  const maisDisponivel = comEstoque.length > 0
    ? comEstoque.reduce((maior, atual) => (atual.estoque > maior.estoque ? atual : maior))
    : null

  const avaliados = produtos.filter((produto) => typeof produto.avaliacao === 'number')
  const melhorAvaliado = avaliados.length >= 2
    ? avaliados.reduce((melhor, atual) => ((atual.avaliacao ?? 0) > (melhor.avaliacao ?? 0) ? atual : melhor))
    : null

  return {
    maisBaratoId: produtos.length > 1 ? maisBarato.id : null,
    maisDisponivelId: produtos.length > 1 && maisDisponivel ? maisDisponivel.id : null,
    melhorAvaliadoId: melhorAvaliado?.id ?? null,
    maiorPreco: Math.max(...produtos.map((produto) => produto.preco)),
  }
}

/**
 * Ordem padrão para listas de produtos: primeiro os que casam com a busca
 * pelo nome (e não só pela descrição), depois os com estoque, depois os
 * mais baratos.
 */
export function ordenarParaComparar(produtos: Produto[], busca = ''): Produto[] {
  const palavras = normalizar(busca).split(/\s+/).filter(Boolean)
  const peso = (produto: Produto) => {
    const nome = normalizar(produto.nome)
    const faltandoNoNome = palavras.filter((palavra) => !nome.includes(palavra)).length
    return faltandoNoNome * 2 + (produto.estoque > 0 ? 0 : 1)
  }
  return [...produtos].sort((a, b) => peso(a) - peso(b) || a.preco - b.preco)
}
