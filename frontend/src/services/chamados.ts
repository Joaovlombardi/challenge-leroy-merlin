import type { Chamado, CriarChamadoRequest, StatusChamado } from '@/types/api'
import { chamadosMock } from '@/mocks/chamadosMock'
import { usandoDadosSimulados } from './catalogo'
import { montarQuery, requisitar } from './http'

/**
 * Operações dos chamados de vendedor. Assim como o catálogo, existem duas
 * implementações com o mesmo contrato: a HTTP (backend real) e a simulada.
 */
export interface ChamadosApi {
  /** POST /api/chamados */
  abrir(pedido: CriarChamadoRequest): Promise<Chamado>
  /** GET /api/chamados?lojaId=&status= */
  listar(filtros?: { lojaId?: number; status?: StatusChamado }): Promise<Chamado[]>
  /** PATCH /api/chamados/{id}/status */
  mudarStatus(id: number, status: StatusChamado): Promise<Chamado>
}

const chamadosHttp: ChamadosApi = {
  abrir(pedido) {
    return requisitar<Chamado>('/api/chamados', { method: 'POST', body: JSON.stringify(pedido) })
  },
  listar(filtros = {}) {
    return requisitar<Chamado[]>(`/api/chamados${montarQuery({ lojaId: filtros.lojaId, status: filtros.status })}`)
  },
  mudarStatus(id, status) {
    return requisitar<Chamado>(`/api/chamados/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },
}

/** Sem VITE_API_URL (ou com VITE_USE_MOCK=true), usa a versão simulada. */
export const chamados: ChamadosApi = usandoDadosSimulados ? chamadosMock : chamadosHttp
