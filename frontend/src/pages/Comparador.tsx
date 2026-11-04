import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Loja, Produto } from '@/types/api'
import { catalogo } from '@/services/catalogo'
import { useCarregar } from '@/hooks/useCarregar'
import { compararProdutos, ordenarParaComparar } from '@/lib/comparacao'
import { plural } from '@/lib/texto'
import { TituloPagina } from '@/components/layout/Layout'
import { AlertaErro, Botao, BotaoLink, Campo, Esqueleto, EstadoVazio } from '@/components/ui'
import { SelecaoProdutos } from '@/components/comparador/SelecaoProdutos'
import { QuadroComparacao } from '@/components/comparador/QuadroComparacao'

const MAXIMO_COMPARADOS = 4
const PADRAO_SELECIONADOS = 3

interface DadosComparador {
  loja: Loja
  produtos: Produto[]
}

function lerIds(texto: string | null): number[] {
  if (!texto) return []
  return texto
    .split(',')
    .map((parte) => Number(parte))
    .filter((numero) => Number.isInteger(numero) && numero > 0)
}

export function Comparador() {
  const [parametros, setParametros] = useSearchParams()
  const lojaId = Number(parametros.get('lojaId'))
  const busca = parametros.get('busca')?.trim() ?? ''
  const idsDaUrl = lerIds(parametros.get('ids'))

  const [selecionados, setSelecionados] = useState<number[]>(idsDaUrl)
  const [termo, setTermo] = useState(busca)
  useEffect(() => setTermo(busca), [busca])

  const lojaValida = Number.isInteger(lojaId) && lojaId > 0

  const dados = useCarregar<DadosComparador>(async () => {
    const [lojas, produtos] = await Promise.all([catalogo.listarLojas(), catalogo.listarProdutos(lojaId, busca)])
    const loja = lojas.find((item) => item.id === lojaId)
    if (!loja) throw new Error('Loja não encontrada')
    return { loja, produtos: ordenarParaComparar(produtos, busca) }
  }, [lojaId, busca])

  // Quando os produtos chegam, escolhe automaticamente os primeiros se a URL não trouxe uma seleção válida.
  useEffect(() => {
    if (!dados.dados) return
    const existentes = dados.dados.produtos.map((produto) => produto.id)
    setSelecionados((atuais) => {
      const validos = atuais.filter((id) => existentes.includes(id))
      return validos.length > 0 ? validos : existentes.slice(0, PADRAO_SELECIONADOS)
    })
  }, [dados.dados])

  const comparados = useMemo(
    () => (dados.dados?.produtos ?? []).filter((produto) => selecionados.includes(produto.id)),
    [dados.dados, selecionados],
  )
  const resultado = useMemo(() => compararProdutos(comparados), [comparados])

  function alternar(produtoId: number) {
    setSelecionados((atuais) => {
      if (atuais.includes(produtoId)) return atuais.filter((id) => id !== produtoId)
      if (atuais.length >= MAXIMO_COMPARADOS) return atuais
      return [...atuais, produtoId]
    })
  }

  function filtrar(evento: FormEvent) {
    evento.preventDefault()
    const query: Record<string, string> = { lojaId: String(lojaId) }
    if (termo.trim()) query.busca = termo.trim()
    setSelecionados([])
    setParametros(query)
  }

  if (!lojaValida) {
    return (
      <div className="mx-auto max-w-xl">
        <EstadoVazio
          titulo="Escolha uma loja para comparar"
          descricao="O comparador mostra as opções de uma loja lado a lado. Comece buscando o produto."
        >
          <BotaoLink to="/lojas">Buscar loja</BotaoLink>
        </EstadoVazio>
      </div>
    )
  }

  const loja = dados.dados?.loja
  const produtos = dados.dados?.produtos ?? []

  return (
    <div>
      <Link
        to={`/lojas?produto=${encodeURIComponent(busca)}${loja ? `&cidade=${encodeURIComponent(loja.cidade)}` : ''}`}
        className="mb-3 inline-block text-sm font-semibold text-accent hover:underline"
      >
        ← Voltar para as lojas
      </Link>

      <TituloPagina
        titulo={busca ? `Comparar "${busca}"` : 'Comparar produtos'}
        descricao={
          loja
            ? `${loja.nome} · ${loja.cidade}${loja.endereco ? ` · ${loja.endereco}` : ''}`
            : 'Carregando loja…'
        }
        acoes={
          loja && (
            <BotaoLink to={`/loja/${loja.id}${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`} variante="secundario">
              Ver na loja
            </BotaoLink>
          )
        }
      />

      <form onSubmit={filtrar} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Campo
          rotulo="Filtrar produtos desta loja"
          icone="busca"
          type="search"
          placeholder="Ex.: tinta 18L"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          className="flex-1"
        />
        <Botao type="submit" variante="secundario" className="h-12">
          Aplicar
        </Botao>
      </form>

      {dados.erro ? (
        <AlertaErro mensagem={dados.erro} aoTentarDeNovo={dados.recarregar} />
      ) : dados.carregando ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Esqueleto className="h-14 w-56" />
            <Esqueleto className="h-14 w-56" />
            <Esqueleto className="h-14 w-56" />
          </div>
          <Esqueleto className="h-96" />
        </div>
      ) : produtos.length === 0 ? (
        <EstadoVazio
          titulo={busca ? `Nada parecido com "${busca}" nesta loja` : 'Esta loja ainda não tem produtos'}
          descricao="Tente uma palavra mais simples ou limpe o filtro para ver tudo que a loja tem."
        >
          {busca && (
            <BotaoLink to={`/comparar?lojaId=${lojaId}`} variante="secundario">
              Limpar filtro
            </BotaoLink>
          )}
          <BotaoLink to="/lojas">Buscar em outra loja</BotaoLink>
        </EstadoVazio>
      ) : (
        <div className="space-y-6">
          <SelecaoProdutos
            produtos={produtos}
            selecionados={selecionados}
            maximo={MAXIMO_COMPARADOS}
            aoAlternar={alternar}
          />

          {comparados.length === 0 ? (
            <EstadoVazio titulo="Selecione pelo menos um produto" />
          ) : (
            <>
              <p className="text-sm text-ink-3">
                Comparando {plural(comparados.length, 'produto', 'produtos')}
                {comparados.length === 1 && '. Marque mais um para ver as diferenças.'}
              </p>
              <QuadroComparacao lojaId={lojaId} produtos={comparados} resultado={resultado} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
