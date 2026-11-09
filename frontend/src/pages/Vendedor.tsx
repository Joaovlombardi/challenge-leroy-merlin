import { useEffect, useState } from 'react'
import type { StatusChamado } from '@/types/api'
import { catalogo } from '@/services/catalogo'
import { chamados } from '@/services/chamados'
import { ApiError } from '@/services/http'
import { mensagemDeErro, useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { TituloPagina } from '@/components/layout/Layout'
import { AlertaErro, Botao, CartaoEsqueleto, EstadoVazio, Icone, Seletor } from '@/components/ui'
import { CartaoChamado } from '@/components/vendedor/CartaoChamado'

/** De quanto em quanto tempo o painel busca chamados novos (em milissegundos). */
const INTERVALO_ATUALIZACAO = 15000

const ABAS: { status: StatusChamado; texto: string; vazio: string }[] = [
  { status: 'ABERTO', texto: 'Abertos', vazio: 'Nenhum chamado aberto' },
  { status: 'EM_ATENDIMENTO', texto: 'Atendendo', vazio: 'Nenhum chamado em atendimento' },
  { status: 'CONCLUIDO', texto: 'Concluídos', vazio: 'Nenhum chamado concluído' },
]

/**
 * Painel do vendedor: /vendedor
 * Lista os chamados de uma loja e permite atender e concluir cada um.
 */
export function Vendedor() {
  const { lojaAtual } = useLojaAtual()
  const [lojaId, setLojaId] = useState(lojaAtual?.id ?? 0)
  const [aba, setAba] = useState<StatusChamado>('ABERTO')
  const [enviandoId, setEnviandoId] = useState<number | null>(null)
  const [erroAcao, setErroAcao] = useState<string | null>(null)

  const lojas = useCarregar(() => catalogo.listarLojas(), [])

  // Chamados da loja + produtos da loja (para mostrar nome e corredor de cada chamado).
  const dados = useCarregar(async () => {
    if (!lojaId) return { chamados: [], produtos: [] }
    const [listaChamados, produtos] = await Promise.all([
      chamados.listar({ lojaId }),
      catalogo.listarProdutos(lojaId),
    ])
    return { chamados: listaChamados, produtos }
  }, [lojaId])

  const { recarregar } = dados

  // Busca chamados novos a cada 15 segundos. O evento "storage" avisa quando
  // outra aba do navegador abriu um chamado (útil com os dados simulados).
  useEffect(() => {
    const intervalo = setInterval(recarregar, INTERVALO_ATUALIZACAO)
    window.addEventListener('storage', recarregar)
    return () => {
      clearInterval(intervalo)
      window.removeEventListener('storage', recarregar)
    }
  }, [recarregar])

  async function mudarStatus(id: number, status: StatusChamado) {
    setEnviandoId(id)
    setErroAcao(null)
    try {
      await chamados.mudarStatus(id, status)
    } catch (e) {
      // Erro 409: outro vendedor mudou este chamado antes (ex.: já atendeu).
      if (e instanceof ApiError && e.status === 409) {
        setErroAcao(`O chamado #${id} já foi atualizado por outro vendedor. A lista foi recarregada.`)
      } else {
        setErroAcao(mensagemDeErro(e))
      }
    } finally {
      setEnviandoId(null)
      recarregar()
    }
  }

  const todos = dados.dados?.chamados ?? []
  const produtos = dados.dados?.produtos ?? []
  const daAba = todos.filter((chamado) => chamado.status === aba)

  return (
    <div>
      <TituloPagina
        titulo="Painel do vendedor"
        descricao="Chamados dos clientes que estão na loja. A lista se atualiza sozinha."
        acoes={
          lojaId > 0 && (
            <Botao variante="secundario" onClick={recarregar}>
              <Icone nome="recarregar" tamanho={16} />
              Atualizar
            </Botao>
          )
        }
      />

      <Seletor
        rotulo="Loja"
        icone="loja"
        textoVazio="Escolha a loja"
        opcoes={(lojas.dados ?? []).map((loja) => ({ valor: String(loja.id), texto: loja.nome }))}
        value={lojaId ? String(lojaId) : ''}
        onChange={(evento) => setLojaId(Number(evento.target.value))}
        className="mb-8 max-w-sm"
      />

      {!lojaId ? (
        <EstadoVazio titulo="Escolha a loja" descricao="Selecione a loja em que você trabalha para ver os chamados." />
      ) : dados.erro ? (
        <AlertaErro mensagem={dados.erro} aoTentarDeNovo={recarregar} />
      ) : (
        <>
          {/* Abas por status, com a quantidade de chamados em cada uma */}
          <div role="tablist" className="mb-6 flex overflow-x-auto border-b border-line sm:gap-1">
            {ABAS.map((item) => {
              const quantidade = todos.filter((chamado) => chamado.status === item.status).length
              const ativa = item.status === aba
              return (
                <button
                  key={item.status}
                  type="button"
                  role="tab"
                  aria-selected={ativa}
                  onClick={() => setAba(item.status)}
                  className={`-mb-px border-b-2 px-3 py-3 text-sm sm:px-4 font-semibold whitespace-nowrap ${
                    ativa ? 'border-accent text-ink' : 'border-transparent text-ink-2 hover:text-ink'
                  }`}
                >
                  {item.texto} <span className="ml-1 rounded-s bg-surface-2 px-1.5 py-0.5 text-xs">{quantidade}</span>
                </button>
              )
            })}
          </div>

          {erroAcao && (
            <div className="mb-6">
              <AlertaErro mensagem={erroAcao} />
            </div>
          )}

          {/* O esqueleto só aparece na primeira carga; nas atualizações a lista fica na tela. */}
          {dados.carregando && !dados.dados ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CartaoEsqueleto />
              <CartaoEsqueleto />
            </div>
          ) : daAba.length === 0 ? (
            <EstadoVazio
              titulo={ABAS.find((item) => item.status === aba)?.vazio ?? ''}
              descricao={aba === 'ABERTO' ? 'Quando um cliente pedir ajuda, o chamado aparece aqui.' : undefined}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {daAba.map((chamado) => (
                <CartaoChamado
                  key={chamado.id}
                  chamado={chamado}
                  produto={produtos.find((produto) => produto.id === chamado.produtoId) ?? null}
                  enviando={enviandoId === chamado.id}
                  aoAtender={() => mudarStatus(chamado.id, 'EM_ATENDIMENTO')}
                  aoConcluir={() => mudarStatus(chamado.id, 'CONCLUIDO')}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
