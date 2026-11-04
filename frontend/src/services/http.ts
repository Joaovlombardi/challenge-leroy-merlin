import type { ErroApi } from '@/types/api'

/** Erro vindo da API (ou da rede), com o status HTTP quando houver. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
  }
}

const MENSAGEM_SEM_CONEXAO =
  'Não foi possível falar com o servidor. Se o backend estiver no Render, ele pode estar acordando: tente de novo em alguns segundos.'

export const urlBaseApi = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

/**
 * Faz uma requisição JSON para o backend e converte erros no formato
 * {"erro": "mensagem"} em ApiError.
 */
export async function requisitar<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${urlBaseApi}${caminho}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string> | undefined),
      },
    })
  } catch {
    throw new ApiError(0, MENSAGEM_SEM_CONEXAO)
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status} ao falar com o servidor`
    try {
      const corpo = (await resposta.json()) as Partial<ErroApi>
      if (corpo.erro) mensagem = corpo.erro
    } catch {
      // resposta sem corpo JSON: mantém a mensagem padrão
    }
    throw new ApiError(resposta.status, mensagem)
  }

  if (resposta.status === 204) return undefined as T
  return (await resposta.json()) as T
}

/** Monta a query string ignorando valores vazios ou indefinidos. */
export function montarQuery(parametros: Record<string, string | number | undefined | null>): string {
  const query = new URLSearchParams()
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor === undefined || valor === null) continue
    const texto = String(valor).trim()
    if (texto) query.set(chave, texto)
  }
  const resultado = query.toString()
  return resultado ? `?${resultado}` : ''
}
