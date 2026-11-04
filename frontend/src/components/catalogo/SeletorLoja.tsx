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
          <h3 className="mb-2 text-xs font-bold tracking-wide text-ink-500 uppercase">{cidade}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {lojas
              .filter((loja) => loja.cidade === cidade)
              .map((loja) => (
                <button
                  key={loja.id}
                  type="button"
                  onClick={() => aoEscolher(loja)}
                  className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-4 text-left transition-colors hover:border-brand-400 hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-200 focus-visible:outline-none"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Icone nome="loja" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink-900">{loja.nome}</span>
                    <span className="block truncate text-sm text-ink-500">{loja.endereco ?? loja.cidade}</span>
                  </span>
                  <Icone nome="seta" className="text-ink-300 transition-colors group-hover:text-brand-600" />
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
