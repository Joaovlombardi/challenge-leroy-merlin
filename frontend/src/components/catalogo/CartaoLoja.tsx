import type { Loja, Produto } from '@/types/api'
import { BotaoLink, Cartao, Icone, Selo } from '@/components/ui'
import { formatarPreco, plural } from '@/lib/texto'
import { ordenarParaComparar } from '@/lib/comparacao'

export interface ResultadoLoja {
  loja: Loja
  /** Produtos da loja que correspondem ao termo buscado (vazio se não houve termo). */
  produtos: Produto[]
  emEstoque: Produto[]
  menorPreco: number | null
  /** Produto mais barato em estoque, mostrado como destaque. */
  destaque: Produto | null
}

/**
 * O destaque é o item mais barato em estoque. Entre os que casam com a busca,
 * os que casam pelo NOME vêm antes dos que casam só pela descrição, para que
 * "tinta parede" destaque uma tinta e não um rolo de pintura.
 */
export function montarResultadoLoja(loja: Loja, produtos: Produto[], termo = ''): ResultadoLoja {
  const emEstoque = produtos.filter((produto) => produto.estoque > 0)
  const candidatos = ordenarParaComparar(emEstoque, termo)
  const destaque = candidatos[0] ?? null
  return { loja, produtos, emEstoque, menorPreco: destaque?.preco ?? null, destaque }
}

interface CartaoLojaProps {
  resultado: ResultadoLoja
  termo: string
  /** Marca a loja com o menor preço entre os resultados. */
  melhorPreco?: boolean
}

export function CartaoLoja({ resultado, termo, melhorPreco = false }: CartaoLojaProps) {
  const { loja, produtos, emEstoque, menorPreco, destaque } = resultado
  const buscou = termo.length > 0
  const query = buscou ? `?busca=${encodeURIComponent(termo)}` : ''

  return (
    <Cartao destacado={melhorPreco} className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Icone nome="loja" tamanho={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-ink-900">{loja.nome}</h3>
          <p className="truncate text-sm text-ink-500">
            {loja.cidade}
            {loja.endereco && ` · ${loja.endereco}`}
          </p>
        </div>
        {melhorPreco && (
          <Selo tom="verde" icone="etiqueta">
            Menor preço
          </Selo>
        )}
      </div>

      {buscou && (
        <div className="mt-4 rounded-xl bg-ink-50 p-4">
          {destaque ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">A partir de</span>
                <span className="text-2xl font-extrabold text-brand-700">{formatarPreco(menorPreco ?? 0)}</span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-ink-900">{destaque.nome}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                <Selo tom="verde" icone="caixa">
                  {plural(emEstoque.length, 'opção em estoque', 'opções em estoque')}
                </Selo>
                <span className="inline-flex items-center gap-1">
                  <Icone nome="rota" tamanho={14} />
                  Corredor {destaque.corredor} · {destaque.secao}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-500">
              {produtos.length > 0
                ? 'Os itens correspondentes estão sem estoque nesta loja.'
                : 'Nenhum produto correspondente nesta loja.'}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <BotaoLink to={`/loja/${loja.id}${query}`}>
          <Icone nome="rota" tamanho={16} />
          Ver na loja
        </BotaoLink>
        {buscou && produtos.length >= 2 && (
          <BotaoLink to={`/comparar?lojaId=${loja.id}&busca=${encodeURIComponent(termo)}`} variante="secundario">
            <Icone nome="comparar" tamanho={16} />
            Comparar {plural(produtos.length, 'opção', 'opções')}
          </BotaoLink>
        )}
      </div>
    </Cartao>
  )
}
