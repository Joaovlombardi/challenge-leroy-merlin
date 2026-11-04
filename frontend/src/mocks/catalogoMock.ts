import type { Loja, Produto } from '@/types/api'
import { correspondeBusca } from '@/lib/texto'
import { ApiError } from '@/services/http'
import type { CatalogoApi } from '@/services/catalogo'
import { lojasMock, produtosMock } from './dados'

/** Simula a latência da rede para que os estados de carregamento apareçam. */
function aguardar(): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, 250 + Math.random() * 350))
}

function produtosDaLoja(lojaId: number): Produto[] {
  return produtosMock.filter((produto) => produto.lojaId === lojaId)
}

function textoDoProduto(produto: Produto): string {
  return `${produto.nome} ${produto.descricao}`
}

/**
 * Implementação em memória com as MESMAS regras do CatalogoService do
 * backend, para que trocar para a API real não mude o comportamento.
 */
export const catalogoMock: CatalogoApi = {
  async listarLojas(filtros = {}) {
    await aguardar()
    return lojasMock.filter(
      (loja) =>
        correspondeBusca(loja.cidade, filtros.cidade) &&
        (!filtros.produto?.trim() ||
          produtosDaLoja(loja.id).some(
            (produto) => produto.estoque > 0 && correspondeBusca(textoDoProduto(produto), filtros.produto),
          )),
    )
  },

  async listarProdutos(lojaId, busca) {
    await aguardar()
    if (!lojasMock.some((loja) => loja.id === lojaId)) {
      throw new ApiError(404, 'Loja não encontrada')
    }
    return produtosDaLoja(lojaId).filter((produto) => correspondeBusca(textoDoProduto(produto), busca))
  },

  async buscarProduto(lojaId, produtoId) {
    const produto = (await this.listarProdutos(lojaId)).find((item) => item.id === produtoId)
    if (!produto) throw new ApiError(404, 'Produto não encontrado nessa loja')
    return produto
  },
}

export { lojasMock, produtosMock } from './dados'
export type { Loja }
