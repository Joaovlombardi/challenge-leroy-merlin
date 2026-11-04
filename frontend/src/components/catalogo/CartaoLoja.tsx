import type { Loja, Produto } from '@/types/api'
import { BotaoLink, Cartao } from '@/components/ui'
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink">{loja.nome}</h3>
          <p className="truncate text-sm text-ink-3">
            {loja.cidade}
            {loja.endereco && ` · ${loja.endereco}`}
          </p>
        </div>
        {melhorPreco && <span className="shrink-0 text-sm font-semibold text-accent">Menor preço</span>}
      </div>

      {buscou && (
        <div className="mt-5 border-t border-line pt-4">
          {destaque ? (
            <>
              <p className={`text-2xl font-semibold ${melhorPreco ? 'text-accent' : 'text-ink'}`}>
                {formatarPreco(menorPreco ?? 0)}
                <span className="ml-2 text-sm font-normal text-ink-3">a partir de</span>
              </p>
              <p className="mt-1 truncate text-sm text-ink-2">{destaque.nome}</p>
              <p className="mt-2 text-sm text-ink-3">
                {plural(emEstoque.length, 'opção em estoque', 'opções em estoque')} · Corredor {destaque.corredor},{' '}
                {destaque.secao}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-3">
              {produtos.length > 0
                ? 'Os itens correspondentes estão sem estoque nesta loja.'
                : 'Nenhum produto correspondente nesta loja.'}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <BotaoLink to={`/loja/${loja.id}${query}`}>Ver na loja</BotaoLink>
        {buscou && produtos.length >= 2 && (
          <BotaoLink to={`/comparar?lojaId=${loja.id}&busca=${encodeURIComponent(termo)}`} variante="secundario">
            Comparar {plural(produtos.length, 'opção', 'opções')}
          </BotaoLink>
        )}
      </div>
    </Cartao>
  )
}
