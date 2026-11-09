import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { ApiError } from '@/services/http'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { formatarPreco } from '@/lib/texto'
import { localizarCorredor } from '@/lib/planta'
import { TituloPagina } from '@/components/layout/Layout'
import { AlertaErro, Avaliacao, BotaoLink, Cartao, Esqueleto, EstadoVazio, SeloEstoque } from '@/components/ui'
import { PlantaLoja } from '@/components/loja/PlantaLoja'

/**
 * Tela do produto: /loja/:lojaId/produto/:produtoId
 * Mostra o produto, onde ele fica e o caminho na planta da loja.
 */
export function Produto() {
  const params = useParams()
  const lojaId = Number(params.lojaId)
  const produtoId = Number(params.produtoId)
  const { definirLojaAtual } = useLojaAtual()

  // Carrega a loja e o produto. Se não existirem, devolve null em vez de erro.
  const dados = useCarregar(async () => {
    const lojas = await catalogo.listarLojas()
    const loja = lojas.find((item) => item.id === lojaId) ?? null
    if (!loja) return { loja: null, produto: null }

    try {
      const produto = await catalogo.buscarProduto(lojaId, produtoId)
      return { loja, produto }
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 404) return { loja, produto: null }
      throw erro
    }
  }, [lojaId, produtoId])

  const loja = dados.dados?.loja
  const produto = dados.dados?.produto

  useEffect(() => {
    if (loja) definirLojaAtual(loja)
  }, [loja, definirLojaAtual])

  if (dados.erro) {
    return <AlertaErro mensagem={dados.erro} aoTentarDeNovo={dados.recarregar} />
  }

  if (dados.carregando) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Esqueleto className="h-80" />
        <Esqueleto className="h-80" />
      </div>
    )
  }

  if (!loja || !produto) {
    return (
      <div className="mx-auto max-w-xl">
        <EstadoVazio
          titulo={loja ? 'Produto não encontrado nesta loja' : 'Loja não encontrada'}
          descricao="Confira o endereço ou volte e busque o produto de novo."
        >
          <BotaoLink to={loja ? `/loja/${loja.id}` : '/'}>{loja ? 'Voltar para a loja' : 'Escolher loja'}</BotaoLink>
        </EstadoVazio>
      </div>
    )
  }

  const destino = localizarCorredor(produto.corredor)

  return (
    <div>
      <Link to={`/loja/${loja.id}`} className="mb-3 inline-block text-sm font-semibold text-accent hover:underline">
        ← Voltar para a {loja.nome}
      </Link>

      <TituloPagina titulo={produto.nome} descricao={produto.marca ? `${produto.marca} · ${loja.nome}` : loja.nome} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do produto */}
        <Cartao className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="mr-auto text-3xl font-semibold text-ink">{formatarPreco(produto.preco)}</p>
            <SeloEstoque estoque={produto.estoque} />
          </div>
          {produto.avaliacao !== undefined && (
            <div className="mt-2">
              <Avaliacao nota={produto.avaliacao} />
            </div>
          )}
          <p className="mt-4 text-ink-2">{produto.descricao}</p>

          <div className="mt-6 rounded-m bg-accent-bg p-4">
            <p className="text-sm text-ink-2">Onde fica</p>
            <p className="text-2xl font-semibold text-accent">Corredor {produto.corredor}</p>
            <p className="text-sm font-semibold text-ink">{produto.secao}</p>
          </div>

          {/* Passo a passo em texto, que complementa o desenho */}
          <h2 className="mt-6 font-semibold text-ink">Como chegar</h2>
          {destino ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-2">
              <li>Entre pela porta principal.</li>
              <li>Siga pelo corredor principal até o corredor {destino.letra}.</li>
              <li>
                Entre no corredor {destino.letra} e avance até o trecho {destino.trecho}, na seção {produto.secao}.
              </li>
            </ol>
          ) : (
            <p className="mt-2 text-sm text-ink-2">
              Procure a seção {produto.secao} no corredor {produto.corredor}. Se precisar, chame um vendedor.
            </p>
          )}

          {produto.estoque <= 0 && (
            <p className="mt-6 text-sm text-ink-2">
              Este produto está sem estoque aqui.{' '}
              <Link
                to={`/lojas?produto=${encodeURIComponent(produto.nome)}`}
                className="font-semibold text-accent hover:underline"
              >
                Ver outras lojas
              </Link>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <BotaoLink to={`/loja/${loja.id}?chamar=1&produtoId=${produto.id}`}>Chamar vendedor</BotaoLink>
            <BotaoLink to={`/loja/${loja.id}`} variante="secundario">
              Buscar outro produto
            </BotaoLink>
          </div>
        </Cartao>

        {/* Planta com a rota. No celular ela vem primeiro (order-first): é o que o cliente mais precisa na loja. */}
        <Cartao className="order-first flex flex-col items-center p-6 md:order-none">
          <h2 className="self-start font-semibold text-ink">
            Caminho até o corredor <span className="text-accent">{produto.corredor}</span>
          </h2>
          <div className="mt-4 w-full max-w-md">
            <PlantaLoja corredor={produto.corredor} />
          </div>
        </Cartao>
      </div>
    </div>
  )
}
