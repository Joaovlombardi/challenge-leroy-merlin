import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { sugestoesBusca } from '@/mocks/dados'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { Botao, BotaoLink, Cartao, Icone, type NomeIcone } from '@/components/ui'
import { FormularioBusca } from '@/components/catalogo/FormularioBusca'
import { SeletorLoja } from '@/components/catalogo/SeletorLoja'

type Modo = 'casa' | 'loja'

const passos: { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: 'busca', titulo: 'Busque', texto: 'Diga a cidade e o que precisa. Mostramos qual loja tem em estoque.' },
  { icone: 'comparar', titulo: 'Compare', texto: 'Veja preço, disponibilidade e localização lado a lado.' },
  { icone: 'rota', titulo: 'Vá direto', texto: 'Chegue ao corredor e à prateleira certa sem dar voltas.' },
  { icone: 'ajuda', titulo: 'Peça ajuda', texto: 'Precisa de um vendedor? Chame sem fila, direto do celular.' },
]

export function Inicio() {
  const navegar = useNavigate()
  const { lojaAtual, definirLojaAtual } = useLojaAtual()
  const [modo, setModo] = useState<Modo>('casa')
  const lojas = useCarregar(() => catalogo.listarLojas(), [])

  const cidades = useMemo(
    () =>
      Array.from(new Set((lojas.dados ?? []).map((loja) => loja.cidade))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [lojas.dados],
  )

  function buscar(cidade: string, produto: string) {
    const query = new URLSearchParams()
    if (cidade) query.set('cidade', cidade)
    if (produto) query.set('produto', produto)
    navegar(`/lojas?${query.toString()}`)
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 pt-10 pb-28 text-white md:px-12 md:pt-16 md:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/60 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-200 uppercase">O Waze da Leroy Merlin</p>
          <h1 className="mt-3 text-3xl leading-tight font-extrabold md:text-5xl">
            Da busca em casa até a prateleira certa.
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-100 md:text-lg">
            Encontre a loja com estoque, compare opções e chegue direto ao corredor. Sem fila, sem volta.
          </p>
        </div>
      </section>

      {/* Painel de entrada: sobrepõe a base do hero */}
      <section className="relative z-10 -mt-20 px-2 md:-mt-24 md:px-8">
        <Cartao className="p-5 shadow-float md:p-7">
          <div role="tablist" aria-label="Onde você está" className="grid grid-cols-2 gap-2 rounded-2xl bg-ink-100 p-1">
            <AbaModo ativo={modo === 'casa'} icone="casa" onClick={() => setModo('casa')}>
              Estou em casa
            </AbaModo>
            <AbaModo ativo={modo === 'loja'} icone="loja" onClick={() => setModo('loja')}>
              Estou na loja
            </AbaModo>
          </div>

          <div className="mt-6">
            {modo === 'casa' ? (
              <>
                <h2 className="text-lg font-bold text-ink-900">Qual loja tem o que você precisa?</h2>
                <p className="mb-4 text-sm text-ink-500">
                  Escolha a cidade e descreva o produto com suas palavras.
                </p>
                <FormularioBusca
                  cidades={cidades}
                  carregandoCidades={lojas.carregando}
                  sugestoes={sugestoesBusca}
                  aoBuscar={buscar}
                />
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-ink-900">Em qual loja você está?</h2>
                <p className="mb-4 text-sm text-ink-500">
                  Escolha a loja para buscar produtos, ver o caminho na planta e chamar um vendedor.
                </p>

                {lojaAtual && (
                  <div className="mb-5 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center">
                    <Icone nome="pin" className="text-brand-600" />
                    <p className="flex-1 text-sm text-brand-900">
                      Você já está na <strong>{lojaAtual.nome}</strong>.
                    </p>
                    <BotaoLink to={`/loja/${lojaAtual.id}`} tamanho="sm">
                      Continuar nesta loja
                      <Icone nome="seta" tamanho={16} />
                    </BotaoLink>
                  </div>
                )}

                <SeletorLoja
                  lojas={lojas.dados}
                  carregando={lojas.carregando}
                  erro={lojas.erro}
                  recarregar={lojas.recarregar}
                  aoEscolher={(loja) => {
                    definirLojaAtual(loja)
                    navegar(`/loja/${loja.id}`)
                  }}
                />

                <p className="mt-5 flex items-start gap-2 text-xs text-ink-500">
                  <Icone nome="qr" tamanho={16} className="mt-0.5" />
                  Na entrada da loja, o QR code abre o Leroy Guia já na loja certa, sem precisar escolher.
                </p>
              </>
            )}
          </div>
        </Cartao>
      </section>

      {/* Como funciona */}
      <section>
        <h2 className="text-xl font-extrabold text-ink-900 md:text-2xl">Como funciona</h2>
        <p className="mt-1 text-sm text-ink-500">Menos tempo perdido na loja, mais chance de sair com o produto certo.</p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo, indice) => (
            <li key={passo.titulo} className="rounded-card border border-ink-100 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Icone nome={passo.icone} />
                </span>
                <span className="text-xs font-bold text-ink-300">0{indice + 1}</span>
              </div>
              <h3 className="mt-4 font-bold text-ink-900">{passo.titulo}</h3>
              <p className="mt-1 text-sm text-ink-500">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Chamada para o vendedor */}
      <section className="flex flex-col gap-4 rounded-card border border-ink-100 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
          <Icone nome="ajuda" tamanho={24} />
        </span>
        <div className="flex-1">
          <h2 className="font-bold text-ink-900">Trabalha na loja?</h2>
          <p className="text-sm text-ink-500">Acompanhe os chamados dos clientes e atenda quem precisa de ajuda.</p>
        </div>
        <BotaoLink to="/vendedor" variante="escuro">
          Painel do vendedor
          <Icone nome="seta" tamanho={16} />
        </BotaoLink>
      </section>
    </div>
  )
}

interface AbaModoProps {
  ativo: boolean
  icone: NomeIcone
  onClick: () => void
  children: string
}

function AbaModo({ ativo, icone, onClick, children }: AbaModoProps) {
  return (
    <Botao
      role="tab"
      aria-selected={ativo}
      onClick={onClick}
      variante="fantasma"
      className={`h-11 rounded-xl ${ativo ? 'bg-white text-brand-800 shadow-sm hover:bg-white' : 'text-ink-500'}`}
    >
      <Icone nome={icone} tamanho={18} />
      {children}
    </Botao>
  )
}
