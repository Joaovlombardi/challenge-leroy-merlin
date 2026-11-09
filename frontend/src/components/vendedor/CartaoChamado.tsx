import type { Chamado, Produto } from '@/types/api'
import { Botao, Cartao, Icone, Selo } from '@/components/ui'
import { tempoDesde } from '@/lib/texto'

interface CartaoChamadoProps {
  chamado: Chamado
  /** Produto do chamado, se o cliente escolheu um. */
  produto: Produto | null
  /** true enquanto a mudança de status deste chamado está sendo enviada. */
  enviando: boolean
  aoAtender: () => void
  aoConcluir: () => void
}

/** Um chamado no painel do vendedor, com o botão da próxima ação. */
export function CartaoChamado({ chamado, produto, enviando, aoAtender, aoConcluir }: CartaoChamadoProps) {
  return (
    <Cartao className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-ink">Chamado #{chamado.id}</p>
        {chamado.status === 'ABERTO' && <Selo tom="aviso">Aberto</Selo>}
        {chamado.status === 'EM_ATENDIMENTO' && <Selo tom="info">Em atendimento</Selo>}
        {chamado.status === 'CONCLUIDO' && <Selo tom="sucesso">Concluído</Selo>}
      </div>
      <p className="mt-1 text-xs text-ink-3">
        Aberto {tempoDesde(chamado.criadoEm)}
        {chamado.status !== 'ABERTO' && ` · atualizado ${tempoDesde(chamado.atualizadoEm)}`}
      </p>

      <p className="mt-4 text-ink">“{chamado.descricao}”</p>

      {produto ? (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-ink-2">
          <Icone nome="pin" tamanho={16} className="mt-0.5 text-accent" />
          <span>
            {produto.nome} · Corredor <strong className="font-semibold text-ink">{produto.corredor}</strong>
          </span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-3">Sem produto específico</p>
      )}

      {chamado.status === 'ABERTO' && (
        <Botao className="mt-5 self-start" disabled={enviando} onClick={aoAtender}>
          {enviando ? 'Enviando…' : 'Atender'}
        </Botao>
      )}
      {chamado.status === 'EM_ATENDIMENTO' && (
        <Botao variante="secundario" className="mt-5 self-start" disabled={enviando} onClick={aoConcluir}>
          {enviando ? 'Enviando…' : 'Concluir'}
        </Botao>
      )}
    </Cartao>
  )
}
