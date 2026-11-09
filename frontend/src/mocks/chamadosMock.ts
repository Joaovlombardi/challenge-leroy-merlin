import type { Chamado } from '@/types/api'
import type { ChamadosApi } from '@/services/chamados'
import { ApiError } from '@/services/http'
import { lojasMock, produtosMock } from './dados'

/**
 * Os chamados simulados ficam no localStorage do navegador. Assim, um
 * chamado aberto como cliente em uma aba aparece no painel do vendedor
 * em outra aba.
 */
const CHAVE_CHAMADOS = 'leroy-guia:chamados'

function lerChamados(): Chamado[] {
  const texto = localStorage.getItem(CHAVE_CHAMADOS)
  return texto ? JSON.parse(texto) : []
}

function salvarChamados(lista: Chamado[]): void {
  localStorage.setItem(CHAVE_CHAMADOS, JSON.stringify(lista))
}

/** Simula a demora da rede para que os estados de carregamento apareçam. */
function aguardar(): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, 300))
}

/**
 * Versão simulada com as MESMAS regras do ChamadoService do backend:
 * - a loja precisa existir;
 * - o produto, se informado, precisa ser dessa loja;
 * - a descrição é obrigatória;
 * - o status só avança ABERTO → EM_ATENDIMENTO → CONCLUIDO.
 */
export const chamadosMock: ChamadosApi = {
  async abrir({ lojaId, produtoId, descricao }) {
    await aguardar()

    if (!descricao || !descricao.trim()) {
      throw new ApiError(400, 'Dados da requisição inválidos')
    }
    if (!lojasMock.some((loja) => loja.id === lojaId)) {
      throw new ApiError(404, 'Loja não encontrada')
    }
    if (produtoId && !produtosMock.some((p) => p.id === produtoId && p.lojaId === lojaId)) {
      throw new ApiError(404, 'Produto não encontrado nessa loja')
    }

    const lista = lerChamados()
    const agora = new Date().toISOString()
    const novo: Chamado = {
      id: lista.length + 1,
      lojaId,
      produtoId: produtoId ?? null,
      descricao: descricao.trim(),
      status: 'ABERTO',
      criadoEm: agora,
      atualizadoEm: agora,
    }
    salvarChamados([...lista, novo])
    return novo
  },

  async listar(filtros = {}) {
    await aguardar()

    if (filtros.lojaId && !lojasMock.some((loja) => loja.id === filtros.lojaId)) {
      throw new ApiError(404, 'Loja não encontrada')
    }
    return lerChamados().filter(
      (chamado) =>
        (!filtros.lojaId || chamado.lojaId === filtros.lojaId) &&
        (!filtros.status || chamado.status === filtros.status),
    )
  },

  async mudarStatus(id, status) {
    await aguardar()

    const lista = lerChamados()
    const atual = lista.find((chamado) => chamado.id === id)
    if (!atual) {
      throw new ApiError(404, 'Chamado não encontrado')
    }

    const podeAvancar =
      (atual.status === 'ABERTO' && status === 'EM_ATENDIMENTO') ||
      (atual.status === 'EM_ATENDIMENTO' && status === 'CONCLUIDO')
    if (!podeAvancar) {
      throw new ApiError(409, 'Transição de status inválida')
    }

    const atualizado: Chamado = { ...atual, status, atualizadoEm: new Date().toISOString() }
    salvarChamados(lista.map((chamado) => (chamado.id === id ? atualizado : chamado)))
    return atualizado
  },
}
