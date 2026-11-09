import { useEffect } from 'react'
import type { Chamado, StatusChamado } from '@/types/api'
import { chamados } from '@/services/chamados'
import { useCarregar } from '@/hooks/useCarregar'
import { Botao, Icone } from '@/components/ui'

/** De quanto em quanto tempo o cliente consulta o status do chamado (em milissegundos). */
const INTERVALO_ATUALIZACAO = 10000

const ETAPAS: { status: StatusChamado; titulo: string; texto: string }[] = [
  { status: 'ABERTO', titulo: 'Chamado enviado', texto: 'Aguardando um vendedor ver o seu pedido.' },
  { status: 'EM_ATENDIMENTO', titulo: 'Vendedor a caminho', texto: 'Um vendedor já pegou o seu chamado e vai até você.' },
  { status: 'CONCLUIDO', titulo: 'Atendimento concluído', texto: 'Obrigado! Se precisar de mais alguma coisa, é só chamar.' },
]

interface AcompanharChamadoProps {
  /** O chamado recém-criado, como voltou do POST. */
  chamado: Chamado
  aoFechar: () => void
}

/**
 * Mostra ao cliente em que pé está o chamado que ele abriu. O contrato não tem
 * GET /api/chamados/{id}, então a tela lista os chamados da loja e procura o dela.
 */
export function AcompanharChamado({ chamado, aoFechar }: AcompanharChamadoProps) {
  const atual = useCarregar(async () => {
    const lista = await chamados.listar({ lojaId: chamado.lojaId })
    return lista.find((item) => item.id === chamado.id) ?? chamado
  }, [chamado.id])

  const { recarregar } = atual

  // Consulta de novo a cada 10 segundos e quando outra aba mexe nos chamados.
  useEffect(() => {
    const intervalo = setInterval(recarregar, INTERVALO_ATUALIZACAO)
    window.addEventListener('storage', recarregar)
    return () => {
      clearInterval(intervalo)
      window.removeEventListener('storage', recarregar)
    }
  }, [recarregar])

  const status = (atual.dados ?? chamado).status
  const posicaoAtual = ETAPAS.findIndex((etapa) => etapa.status === status)

  return (
    <div role="status" className="rounded-m border border-success-border bg-success-bg p-5">
      <p className="text-sm text-ink-2">Chamado #{chamado.id}</p>

      {/* Linha do tempo: etapas já alcançadas ficam verdes */}
      <ol className="mt-3 space-y-3">
        {ETAPAS.map((etapa, posicao) => {
          const alcancada = posicao <= posicaoAtual
          const ehAtual = posicao === posicaoAtual
          return (
            <li key={etapa.status} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  alcancada ? 'border-accent bg-accent text-white' : 'border-line bg-white'
                }`}
              >
                {alcancada && <Icone nome="check" tamanho={14} />}
              </span>
              <div>
                <p className={`font-semibold ${alcancada ? 'text-ink' : 'text-ink-3'}`}>{etapa.titulo}</p>
                {ehAtual && <p className="text-sm text-ink-2">{etapa.texto}</p>}
              </div>
            </li>
          )
        })}
      </ol>

      <Botao variante="secundario" tamanho="sm" className="mt-5" onClick={aoFechar}>
        Fechar
      </Botao>
    </div>
  )
}
