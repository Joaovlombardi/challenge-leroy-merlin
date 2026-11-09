import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { plural } from '@/lib/texto'
import { TituloPagina } from '@/components/layout/Layout'
import { AlertaErro, Botao, BotaoLink, Campo, CartaoEsqueleto, EstadoVazio } from '@/components/ui'
import { CartaoProduto } from '@/components/loja/CartaoProduto'
import { FormularioChamado } from '@/components/loja/FormularioChamado'

/**
 * Tela da loja: /loja/:lojaId
 *
 * Parâmetros opcionais na URL (enviados pelas telas da Pessoa 1):
 * - ?busca=tinta         abre a tela já buscando esse termo
 * - ?chamar=1            abre o painel de chamar vendedor
 * - ?produtoId=101       junto com chamar=1, já seleciona o produto
 */
export function Loja() {
  const { lojaId: lojaIdTexto } = useParams()
  const lojaId = Number(lojaIdTexto)
  const [parametros, setParametros] = useSearchParams()
  const busca = parametros.get('busca') ?? ''
  const chamadoAberto = parametros.get('chamar') === '1'
  const produtoIdDoChamado = Number(parametros.get('produtoId'))

  const [termo, setTermo] = useState(busca)
  useEffect(() => setTermo(busca), [busca])
  const { definirLojaAtual } = useLojaAtual()
  const painelRef = useRef<HTMLDivElement>(null)

  // Carrega a loja e, se ela existir, os produtos que combinam com a busca.
  const dados = useCarregar(async () => {
    const lojas = await catalogo.listarLojas()
    const loja = lojas.find((item) => item.id === lojaId) ?? null
    if (!loja) return { loja: null, produtos: [] }

    const produtos = await catalogo.listarProdutos(lojaId, busca)
    return { loja, produtos }
  }, [lojaId, busca])

  const loja = dados.dados?.loja
  const produtos = dados.dados?.produtos ?? []

  // Ao abrir a tela de uma loja (inclusive pelo QR code), ela vira a "loja atual".
  useEffect(() => {
    if (loja) definirLojaAtual(loja)
  }, [loja, definirLojaAtual])

  // Quando o painel de chamado abre, rola a tela até ele.
  useEffect(() => {
    if (chamadoAberto) painelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [chamadoAberto])

  function buscar(evento: FormEvent) {
    evento.preventDefault()
    setParametros(termo.trim() ? { busca: termo.trim() } : {})
  }

  function abrirChamado(produtoId?: number) {
    const novos: Record<string, string> = { chamar: '1' }
    if (busca) novos.busca = busca
    if (produtoId) novos.produtoId = String(produtoId)
    setParametros(novos)
  }

  function fecharChamado() {
    setParametros(busca ? { busca } : {})
  }

  if (dados.erro) {
    return <AlertaErro mensagem={dados.erro} aoTentarDeNovo={dados.recarregar} />
  }

  if (!dados.carregando && !loja) {
    return (
      <div className="mx-auto max-w-xl">
        <EstadoVazio titulo="Loja não encontrada" descricao="Confira o endereço ou escolha a loja na tela inicial.">
          <BotaoLink to="/">Escolher loja</BotaoLink>
        </EstadoVazio>
      </div>
    )
  }

  const produtoDoChamado = produtos.find((produto) => produto.id === produtoIdDoChamado) ?? null

  return (
    <div>
      <TituloPagina
        titulo={loja ? loja.nome : 'Carregando loja…'}
        descricao="Diga o que você procura e veja onde está na loja."
        acoes={
          !chamadoAberto && (
            <Botao variante="secundario" onClick={() => abrirChamado()}>
              Chamar vendedor
            </Botao>
          )
        }
      />

      {chamadoAberto && (
        <div ref={painelRef} className="mb-10">
          {/* key: se o produto mudar, o formulário recomeça vazio */}
          <FormularioChamado
            key={produtoIdDoChamado}
            lojaId={lojaId}
            produto={produtoDoChamado}
            aoFechar={fecharChamado}
          />
        </div>
      )}

      <form onSubmit={buscar} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Campo
          rotulo="O que você procura?"
          icone="busca"
          type="search"
          placeholder="Ex.: tinta parede, furadeira, torneira"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          className="flex-1"
        />
        <Botao type="submit" className="h-12">
          Buscar
        </Botao>
      </form>

      {dados.carregando ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CartaoEsqueleto />
          <CartaoEsqueleto />
          <CartaoEsqueleto />
        </div>
      ) : produtos.length === 0 ? (
        <EstadoVazio
          titulo={`Não achamos "${busca}" nesta loja`}
          descricao="Tente uma palavra mais simples ou peça ajuda a um vendedor."
        >
          <Botao onClick={() => abrirChamado()}>Chamar vendedor</Botao>
        </EstadoVazio>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-3">
            {busca
              ? `${plural(produtos.length, 'produto encontrado', 'produtos encontrados')} para "${busca}"`
              : `Todos os ${plural(produtos.length, 'produto', 'produtos')} da loja`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <CartaoProduto key={produto.id} produto={produto} aoChamarVendedor={() => abrirChamado(produto.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
