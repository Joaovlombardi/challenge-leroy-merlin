import { useParams, useSearchParams } from 'react-router-dom'
import { BotaoLink, Cartao, Icone, Selo } from '@/components/ui'

interface EmConstrucaoProps {
  titulo: string
  descricao: string
  responsavel?: string
}

/**
 * Página reservada para telas de outras pessoas do grupo. Mostra os
 * parâmetros que a rota recebeu, para quem for implementar saber
 * exatamente o que as telas da Pessoa 1 enviam.
 */
export function EmConstrucao({ titulo, descricao, responsavel = 'Pessoa 2' }: EmConstrucaoProps) {
  const parametros = useParams()
  const [query] = useSearchParams()
  const recebidos = [
    ...Object.entries(parametros).map(([chave, valor]) => [chave, valor ?? ''] as const),
    ...Array.from(query.entries()),
  ]

  return (
    <div className="mx-auto max-w-xl">
      <Cartao className="p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg text-warning">
          <Icone nome="obra" tamanho={30} />
        </div>
        <Selo tom="info" className="mt-5">
          Em construção · {responsavel}
        </Selo>
        <h1 className="mt-3 text-2xl font-semibold text-ink">{titulo}</h1>
        <p className="mt-2 text-sm text-ink-3">{descricao}</p>

        {recebidos.length > 0 && (
          <dl className="mt-6 rounded-m bg-surface-2 p-4 text-left text-sm">
            <p className="mb-2 text-xs font-semibold tracking-wide text-ink-3 uppercase">Parâmetros recebidos</p>
            {recebidos.map(([chave, valor]) => (
              <div key={chave} className="flex justify-between gap-4 border-t border-line py-1.5 first:border-0">
                <dt className="font-mono text-ink-2">{chave}</dt>
                <dd className="font-mono font-semibold text-ink">{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <BotaoLink to="/" variante="secundario">
            <Icone nome="voltar" tamanho={16} />
            Início
          </BotaoLink>
          <BotaoLink to="/lojas">Buscar loja</BotaoLink>
        </div>
      </Cartao>
    </div>
  )
}
