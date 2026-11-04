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
      <div className="space-y-2">
        {[1, 2, 3, 4].map((indice) => (
          <Esqueleto key={indice} className="h-14" />
        ))}
      </div>
    )
  }

  const cidades = Array.from(new Set(lojas.map((loja) => loja.cidade))).sort((a, b) => a.localeCompare(b, 'pt-BR'))

  return (
    <div className="divide-y divide-line rounded-m border border-line bg-white">
      {cidades.map((cidade) => (
        <section key={cidade} className="px-4 py-3">
          <h3 className="text-xs font-semibold text-ink-3 uppercase">{cidade}</h3>
          <ul className="mt-1">
            {lojas
              .filter((loja) => loja.cidade === cidade)
              .map((loja) => (
                <li key={loja.id}>
                  <button
                    type="button"
                    onClick={() => aoEscolher(loja)}
                    className="group -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-s px-2 py-2.5 text-left transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{loja.nome}</span>
                      {loja.endereco && <span className="block truncate text-sm text-ink-3">{loja.endereco}</span>}
                    </span>
                    <Icone nome="seta" tamanho={18} className="text-line transition-colors group-hover:text-accent" />
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
