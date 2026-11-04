/**
 * Tipos espelhando o contrato HTTP do backend (ver backend/README.md).
 *
 * Os campos marcados como opcionais (endereco, marca, avaliacao, imagemUrl)
 * NÃO existem no contrato atual. Eles ficam aqui para que, se as pessoas 3 e 4
 * decidirem adicioná-los, as telas passem a exibi-los sem nenhuma alteração.
 */

export interface Loja {
  id: number
  nome: string
  cidade: string
  /** Extra: não existe no contrato atual. */
  endereco?: string
}

export interface Produto {
  id: number
  lojaId: number
  nome: string
  descricao: string
  /** Preço em reais. */
  preco: number
  estoque: number
  corredor: string
  secao: string
  /** Extra: não existe no contrato atual. */
  marca?: string
  /** Extra: nota de 0 a 5. Não existe no contrato atual. */
  avaliacao?: number
  /** Extra: não existe no contrato atual. */
  imagemUrl?: string
}

export type StatusChamado = 'ABERTO' | 'EM_ATENDIMENTO' | 'CONCLUIDO'

export interface Chamado {
  id: number
  lojaId: number
  produtoId: number | null
  descricao: string
  status: StatusChamado
  /** Instante ISO 8601 em UTC. */
  criadoEm: string
  atualizadoEm: string
}

export interface CriarChamadoRequest {
  lojaId: number
  produtoId?: number
  descricao: string
}

export interface AtualizarStatusRequest {
  status: StatusChamado
}

/** Formato das respostas de erro tratadas pelo backend. */
export interface ErroApi {
  erro: string
}

export interface FiltroLojas {
  cidade?: string
  produto?: string
}
