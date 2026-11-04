import type { Produto } from '@/types/api'
import { Icone } from '@/components/ui'
import { formatarPreco } from '@/lib/texto'

interface SelecaoProdutosProps {
  produtos: Produto[]
  selecionados: number[]
  maximo: number
  aoAlternar: (produtoId: number) => void
}

/** Lista de produtos com marcação dos que entram na comparação. */
export function SelecaoProdutos({ produtos, selecionados, maximo, aoAlternar }: SelecaoProdutosProps) {
  const lotado = selecionados.length >= maximo

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink-700">Escolha o que comparar</h2>
        <span className="text-xs text-ink-500">
          {selecionados.length} de {maximo}
        </span>
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-2 sem-barra md:flex-wrap md:overflow-visible">
        {produtos.map((produto) => {
          const ativo = selecionados.includes(produto.id)
          const desabilitado = !ativo && lotado
          return (
            <li key={produto.id} className="shrink-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={ativo}
                disabled={desabilitado}
                onClick={() => aoAlternar(produto.id)}
                title={desabilitado ? `Você pode comparar até ${maximo} produtos` : undefined}
                className={
                  'flex max-w-[16rem] items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ' +
                  'focus-visible:ring-4 focus-visible:ring-brand-200 focus-visible:outline-none disabled:opacity-40 ' +
                  (ativo
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300')
                }
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    ativo ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300 bg-white'
                  }`}
                >
                  {ativo && <Icone nome="check" tamanho={14} />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{produto.nome}</span>
                  <span className="block text-xs text-ink-500">
                    {formatarPreco(produto.preco)}
                    {produto.estoque <= 0 && ' · sem estoque'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
