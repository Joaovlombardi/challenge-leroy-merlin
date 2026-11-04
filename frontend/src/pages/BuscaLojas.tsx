import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { useCarregar } from '@/hooks/useCarregar'
import { plural } from '@/lib/texto'
import { TituloPagina } from '@/components/layout/Layout'
import { AlertaErro, BotaoLink, CartaoEsqueleto, EstadoVazio, Seletor } from '@/components/ui'
import { FormularioBusca } from '@/components/catalogo/FormularioBusca'
import { CartaoLoja, montarResultadoLoja, type ResultadoLoja } from '@/components/catalogo/CartaoLoja'

type Ordem = 'preco' | 'estoque' | 'nome'

const opcoesOrdem: { valor: Ordem; texto: string }[] = [
  { valor: 'preco', texto: 'Menor preço' },
  { valor: 'estoque', texto: 'Mais opções em estoque' },
  { valor: 'nome', texto: 'Nome da loja' },
]

export function BuscaLojas() {
  const [parametros, setParametros] = useSearchParams()
  const cidade = parametros.get('cidade')?.trim() ?? ''
  const produto = parametros.get('produto')?.trim() ?? ''
  const [ordem, setOrdem] = useState<Ordem>('preco')

  // Todas as lojas, só para montar a lista de cidades do formulário.
  const todasLojas = useCarregar(() => catalogo.listarLojas(), [])
  const cidades = useMemo(
    () =>
      Array.from(new Set((todasLojas.dados ?? []).map((loja) => loja.cidade))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [todasLojas.dados],
  )

  // Lojas filtradas e, quando há termo, os produtos correspondentes de cada uma.
  const resultados = useCarregar<ResultadoLoja[]>(async () => {
    const lojas = await catalogo.listarLojas({ cidade, produto })
    if (!produto) return lojas.map((loja) => montarResultadoLoja(loja, []))
    const produtosPorLoja = await Promise.all(lojas.map((loja) => catalogo.listarProdutos(loja.id, produto)))
    return lojas.map((loja, indice) => montarResultadoLoja(loja, produtosPorLoja[indice], produto))
  }, [cidade, produto])

  const ordenados = useMemo(() => {
    const lista = [...(resultados.dados ?? [])]
    if (!produto) return lista.sort((a, b) => a.loja.nome.localeCompare(b.loja.nome, 'pt-BR'))
    return lista.sort((a, b) => {
      if (ordem === 'estoque') return b.emEstoque.length - a.emEstoque.length
      if (ordem === 'nome') return a.loja.nome.localeCompare(b.loja.nome, 'pt-BR')
      return (a.menorPreco ?? Infinity) - (b.menorPreco ?? Infinity)
    })
  }, [resultados.dados, ordem, produto])

  const idMelhorPreco = useMemo(() => {
    const comPreco = ordenados.filter((item) => item.menorPreco !== null)
    if (comPreco.length < 2) return null
    return comPreco.reduce((menor, atual) => ((atual.menorPreco ?? 0) < (menor.menorPreco ?? 0) ? atual : menor))
      .loja.id
  }, [ordenados])

  function buscar(novaCidade: string, novoProduto: string) {
    const query: Record<string, string> = {}
    if (novaCidade) query.cidade = novaCidade
    if (novoProduto) query.produto = novoProduto
    setParametros(query)
  }

  const titulo = produto ? `Lojas com "${produto}"` : cidade ? `Lojas em ${cidade}` : 'Todas as lojas'
  const descricao = produto
    ? `Só aparecem lojas com o produto em estoque${cidade ? ` em ${cidade}` : ''}.`
    : 'Escolha uma loja ou busque um produto para ver onde ele está disponível.'

  return (
    <div>
      <TituloPagina titulo={titulo} descricao={descricao} />

      <div className="rounded-m border border-line bg-white p-4 shadow-card md:p-5">
        <FormularioBusca
          compacto
          cidades={cidades}
          carregandoCidades={todasLojas.carregando}
          cidadeInicial={cidade}
          produtoInicial={produto}
          aoBuscar={buscar}
        />
      </div>

      <div className="mt-8">
        {resultados.erro ? (
          <AlertaErro mensagem={resultados.erro} aoTentarDeNovo={resultados.recarregar} />
        ) : resultados.carregando ? (
          <div className="grid gap-4 md:grid-cols-2">
            <CartaoEsqueleto />
            <CartaoEsqueleto />
          </div>
        ) : ordenados.length === 0 ? (
          <EstadoVazio
            titulo={produto ? `Nenhuma loja tem "${produto}" em estoque` : 'Nenhuma loja encontrada'}
            descricao={
              produto
                ? 'Tente outra palavra, como "tinta" em vez de "tinta fosca branca", ou busque em todas as cidades.'
                : 'Tente outra cidade.'
            }
          >
            {cidade && (
              <BotaoLink to={`/lojas?produto=${encodeURIComponent(produto)}`} variante="secundario">
                Buscar em todas as cidades
              </BotaoLink>
            )}
            <BotaoLink to="/">Voltar ao início</BotaoLink>
          </EstadoVazio>
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-3">
                {plural(ordenados.length, 'loja encontrada', 'lojas encontradas')}
              </p>
              {produto && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-2">Ordenar por</span>
                  <Seletor
                    rotulo=""
                    aria-label="Ordenar por"
                    className="[&_label]:hidden"
                    value={ordem}
                    onChange={(evento) => setOrdem(evento.target.value as Ordem)}
                    opcoes={opcoesOrdem}
                  />
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ordenados.map((resultado) => (
                <CartaoLoja
                  key={resultado.loja.id}
                  resultado={resultado}
                  termo={produto}
                  melhorPreco={resultado.loja.id === idMelhorPreco}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
