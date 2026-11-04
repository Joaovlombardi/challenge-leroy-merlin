import { Estrela } from './Icone'

/** Cinco estrelas com a nota ao lado. Só aparece se o produto tiver nota. */
export function Avaliacao({ nota }: { nota: number }) {
  const cheias = Math.round(nota)
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Avaliação ${nota.toFixed(1)} de 5`}>
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((posicao) => (
          <Estrela key={posicao} cheia={posicao <= cheias} />
        ))}
      </span>
      <span className="text-xs font-semibold text-ink-700">{nota.toFixed(1)}</span>
    </span>
  )
}
