import type { Loja } from '@/types/api'
import { AlertaErro, Esqueleto, Icone } from '@/components/ui'

interface SeletorLojaProps {
  lojas: Loja[] | null
  carregando: boolean
  erro: string | null
  recarregar: () => void
  aoEscolher: (loja: Loja) => void
}

/** Lista de lojas agrupadas por cidade para o cliente dizer onde está. */
export function SeletorLoja({ lojas, carregando, erro, recarregar, aoEscolher }: SeletorLojaProps) {
  if (erro) return <AlertaErro mensagem={erro} aoTentarDeNovo={recarregar} />

  if (carregando || !lojas) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((indice) => (
          <Esqueleto key={indice} className="h-20" />
        ))}
      </div>
    )
  }

  const cidades = Array.from(new Set(lojas.map((loja) => loja.cidade))).sort((a, b) => a.localeCompare(b, 'pt-BR'))

  return (
    <div className="space-y-5">
      {cidades.map((cidade) => (
        <section key={cidade}>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-3 uppercase">{cidade}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {lojas
              .filter((loja) => loja.cidade === cidade)
              .map((loja) => (
                <button
                  key={loja.id}
                  type="button"
                  onClick={() => aoEscolher(loja)}
                  className="group flex items-center gap-3 rounded-m border border-line bg-white p-4 text-left transition-colors hover:border-accent-border hover:bg-accent-bg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-bg text-accent">
                    <Icone nome="loja" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{loja.nome}</span>
                    <span className="block truncate text-sm text-ink-3">{loja.endereco ?? loja.cidade}</span>
                  </span>
                  <Icone nome="seta" className="text-line transition-colors group-hover:text-accent" />
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
