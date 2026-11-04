import type { ReactNode } from 'react'
import type { Produto } from '@/types/api'
import { Avaliacao, BotaoLink, Cartao, SeloEstoque } from '@/components/ui'
import { formatarPreco } from '@/lib/texto'
import type { ResultadoComparacao } from '@/lib/comparacao'

interface QuadroComparacaoProps {
  lojaId: number
  produtos: Produto[]
  resultado: ResultadoComparacao
}

function linkPrateleira(lojaId: number, produtoId: number): string {
  return `/loja/${lojaId}/produto/${produtoId}`
}

function linkVendedor(lojaId: number, produtoId: number): string {
  return `/loja/${lojaId}?chamar=1&produtoId=${produtoId}`
}

/** Rótulos curtos em verde de ação, sem selos: "Menor preço", "Mais disponível", "Melhor avaliado". */
function Destaques({ produto, resultado }: { produto: Produto; resultado: ResultadoComparacao }) {
  const rotulos: string[] = []
  if (produto.id === resultado.maisBaratoId) rotulos.push('Menor preço')
  if (produto.id === resultado.maisDisponivelId) rotulos.push('Mais disponível')
  if (produto.id === resultado.melhorAvaliadoId) rotulos.push('Melhor avaliado')
  return <p className="min-h-5 text-sm font-semibold text-accent">{rotulos.join(' · ')}</p>
}

function Economia({ produto, maiorPreco }: { produto: Produto; maiorPreco: number }) {
  const diferenca = maiorPreco - produto.preco
  if (diferenca <= 0.005) return <p className="text-sm text-ink-3">Opção mais cara</p>
  return <p className="text-sm text-ink-2">{formatarPreco(diferenca)} a menos que a mais cara</p>
}

function Localizacao({ produto }: { produto: Produto }) {
  return (
    <p className="text-sm text-ink">
      Corredor <strong className="font-semibold">{produto.corredor}</strong>, {produto.secao}
    </p>
  )
}

function Acoes({ lojaId, produto }: { lojaId: number; produto: Produto }) {
  return (
    <div className="flex flex-col gap-2">
      <BotaoLink to={linkPrateleira(lojaId, produto.id)} tamanho="sm">
        Ir até a prateleira
      </BotaoLink>
      <BotaoLink to={linkVendedor(lojaId, produto.id)} variante="secundario" tamanho="sm">
        Chamar vendedor
      </BotaoLink>
    </div>
  )
}

/**
 * Comparação lado a lado. No celular vira uma fileira de cartões com
 * rolagem horizontal; em telas maiores, uma tabela com uma coluna por produto.
 */
export function QuadroComparacao({ lojaId, produtos, resultado }: QuadroComparacaoProps) {
  const temMarca = produtos.some((produto) => produto.marca)
  const temNota = produtos.some((produto) => typeof produto.avaliacao === 'number')

  return (
    <>
      {/* Celular: cartões */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sem-barra md:hidden">
        {produtos.map((produto) => (
          <Cartao
            key={produto.id}
            destacado={produto.id === resultado.maisBaratoId}
            className="flex w-[82vw] max-w-xs shrink-0 snap-center flex-col gap-3 p-5"
          >
            <Destaques produto={produto} resultado={resultado} />
            <div>
              {produto.marca && <p className="text-xs text-ink-3 uppercase">{produto.marca}</p>}
              <h3 className="font-semibold text-ink">{produto.nome}</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{formatarPreco(produto.preco)}</p>
              <Economia produto={produto} maiorPreco={resultado.maiorPreco} />
            </div>
            <SeloEstoque estoque={produto.estoque} />
            <Localizacao produto={produto} />
            {typeof produto.avaliacao === 'number' && <Avaliacao nota={produto.avaliacao} />}
            <p className="text-sm text-ink-2">{produto.descricao}</p>
            <div className="mt-auto pt-2">
              <Acoes lojaId={lojaId} produto={produto} />
            </div>
          </Cartao>
        ))}
      </div>

      {/* Telas maiores: tabela */}
      <div className="hidden overflow-x-auto rounded-m border border-line bg-white md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="align-top">
              <th scope="col" className="w-32 border-t-4 border-t-transparent p-4 text-xs font-semibold text-ink-3 uppercase">
                Produto
              </th>
              {produtos.map((produto) => (
                <th
                  key={produto.id}
                  scope="col"
                  className={`p-4 align-top ${produto.id === resultado.maisBaratoId ? 'border-t-4 border-t-brand bg-accent-bg' : 'border-t-4 border-t-transparent'}`}
                >
                  <Destaques produto={produto} resultado={resultado} />
                  {produto.marca && <p className="mt-2 text-xs text-ink-3 uppercase">{produto.marca}</p>}
                  <p className="mt-1 text-base font-semibold text-ink">{produto.nome}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_td]:border-t [&_td]:border-line [&_th]:border-t [&_th]:border-line">
            <Linha titulo="Preço" produtos={produtos} resultado={resultado}>
              {(produto) => (
                <>
                  <p className={`text-2xl font-semibold ${produto.id === resultado.maisBaratoId ? 'text-accent' : 'text-ink'}`}>
                    {formatarPreco(produto.preco)}
                  </p>
                  <Economia produto={produto} maiorPreco={resultado.maiorPreco} />
                </>
              )}
            </Linha>
            <Linha titulo="Estoque" produtos={produtos} resultado={resultado}>
              {(produto) => <SeloEstoque estoque={produto.estoque} />}
            </Linha>
            <Linha titulo="Onde fica" produtos={produtos} resultado={resultado}>
              {(produto) => <Localizacao produto={produto} />}
            </Linha>
            {temMarca && (
              <Linha titulo="Marca" produtos={produtos} resultado={resultado}>
                {(produto) => <span className="text-ink">{produto.marca ?? '—'}</span>}
              </Linha>
            )}
            {temNota && (
              <Linha titulo="Avaliação" produtos={produtos} resultado={resultado}>
                {(produto) =>
                  typeof produto.avaliacao === 'number' ? <Avaliacao nota={produto.avaliacao} /> : <span>—</span>
                }
              </Linha>
            )}
            <Linha titulo="Descrição" produtos={produtos} resultado={resultado}>
              {(produto) => <p className="text-ink-2">{produto.descricao}</p>}
            </Linha>
            <Linha titulo="" produtos={produtos} resultado={resultado}>
              {(produto) => <Acoes lojaId={lojaId} produto={produto} />}
            </Linha>
          </tbody>
        </table>
      </div>
    </>
  )
}

interface LinhaProps {
  titulo: string
  produtos: Produto[]
  resultado: ResultadoComparacao
  children: (produto: Produto) => ReactNode
}

function Linha({ titulo, produtos, resultado, children }: LinhaProps) {
  return (
    <tr className="align-top">
      <th scope="row" className="p-4 text-xs font-semibold text-ink-3 uppercase">
        {titulo}
      </th>
      {produtos.map((produto) => (
        <td key={produto.id} className={`p-4 ${produto.id === resultado.maisBaratoId ? 'bg-accent-bg' : ''}`}>
          {children(produto)}
        </td>
      ))}
    </tr>
  )
}
