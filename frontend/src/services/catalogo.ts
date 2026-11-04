import type { FiltroLojas, Loja, Produto } from '@/types/api'
import { catalogoMock } from '@/mocks/catalogoMock'
import { montarQuery, requisitar } from './http'

/**
 * Operações de catálogo (lojas e produtos) usadas pelas telas da Pessoa 1.
 * Existem duas implementações com o mesmo contrato: a HTTP (backend real) e
 * a simulada (dados em memória). A escolha é feita por variável de ambiente.
 */
export interface CatalogoApi {
  /** GET /api/lojas?cidade=&produto= */
  listarLojas(filtros?: FiltroLojas): Promise<Loja[]>
  /** GET /api/lojas/{lojaId}/produtos?busca= */
  listarProdutos(lojaId: number, busca?: string): Promise<Produto[]>
  /** GET /api/lojas/{lojaId}/produtos/{produtoId} */
  buscarProduto(lojaId: number, produtoId: number): Promise<Produto>
}

const catalogoHttp: CatalogoApi = {
  listarLojas(filtros = {}) {
    return requisitar<Loja[]>(`/api/lojas${montarQuery({ cidade: filtros.cidade, produto: filtros.produto })}`)
  },
  listarProdutos(lojaId, busca) {
    return requisitar<Produto[]>(`/api/lojas/${lojaId}/produtos${montarQuery({ busca })}`)
  },
  buscarProduto(lojaId, produtoId) {
    return requisitar<Produto>(`/api/lojas/${lojaId}/produtos/${produtoId}`)
  },
}

/** true quando o site está usando dados simulados em vez do backend. */
export const usandoDadosSimulados =
  import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL

export const catalogo: CatalogoApi = usandoDadosSimulados ? catalogoMock : catalogoHttp
