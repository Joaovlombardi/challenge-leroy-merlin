import type { Loja } from '@/types/api'
import { AlertaErro, Esqueleto, Icone } from '@/components/ui'

interface SeletorLojaProps {
  lojas: Loja[] | null
  carregando: boolean
  erro: string | null
  recarregar: () => void
  /** Loja em que o cliente já disse estar; aparece marcada. */
  lojaAtualId?: number | null
  aoEscolher: (loja: Loja) => void
}

/** Grade de lojas para o cliente dizer onde está. */
export function SeletorLoja({ lojas, carregando, erro, recarregar, lojaAtualId = null, aoEscolher }: SeletorLojaProps) {
  if (erro) return <AlertaErro mensagem={erro} aoTentarDeNovo={recarregar} />

  if (carregando || !lojas) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((indice) => (
          <Esqueleto key={indice} className="h-40" />
        ))}
      </div>
    )
  }

  const ordenadas = [...lojas].sort(
    (a, b) => a.cidade.localeCompare(b.cidade, 'pt-BR') || a.nome.localeCompare(b.nome, 'pt-BR'),
  )

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ordenadas.map((loja) => {
        const atual = loja.id === lojaAtualId
        return (
          <li key={loja.id}>
            <button
              type="button"
              onClick={() => aoEscolher(loja)}
              aria-current={atual ? 'true' : undefined}
              className={
                'group flex h-full w-full flex-col rounded-m border bg-white p-5 text-left transition-colors ' +
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none ' +
                (atual ? 'border-line border-t-4 border-t-brand' : 'border-line hover:border-accent')
              }
            >
              <span className="text-xs font-semibold text-ink-3 uppercase">{loja.cidade}</span>
              <span className="mt-2 text-lg leading-tight font-semibold text-ink">{loja.nome}</span>
              {loja.endereco && <span className="mt-1 text-sm text-ink-3">{loja.endereco}</span>}
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent">
                {atual ? 'Você está aqui' : 'Entrar na loja'}
                <Icone
                  nome="seta"
                  tamanho={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
