import { useParams, useSearchParams } from 'react-router-dom'
import { BotaoLink } from '@/components/ui'

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
    <div className="mx-auto max-w-xl py-8">
      <p className="text-sm font-semibold text-accent">Em construção · {responsavel}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">{titulo}</h1>
      <p className="mt-3 text-ink-2">{descricao}</p>

      {recebidos.length > 0 && (
        <dl className="mt-8 rounded-m bg-surface-2 p-4 text-sm">
          <p className="mb-2 text-xs font-semibold text-ink-3 uppercase">Parâmetros recebidos</p>
          {recebidos.map(([chave, valor]) => (
            <div key={chave} className="flex justify-between gap-4 border-t border-line py-1.5 first:border-0">
              <dt className="font-mono text-ink-2">{chave}</dt>
              <dd className="font-mono font-semibold text-ink">{valor}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <BotaoLink to="/lojas">Buscar loja</BotaoLink>
        <BotaoLink to="/" variante="secundario">
          Início
        </BotaoLink>
      </div>
    </div>
  )
}
