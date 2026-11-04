import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { sugestoesBusca } from '@/mocks/dados'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { TituloSecao } from '@/components/layout/Layout'
import { FormularioBusca } from '@/components/catalogo/FormularioBusca'
import { SeletorLoja } from '@/components/catalogo/SeletorLoja'

const jornada = [
  { momento: 'Em casa', texto: 'veja qual loja tem o produto em estoque e por quanto.' },
  { momento: 'Na loja', texto: 'descreva o que precisa e siga até o corredor certo.' },
  { momento: 'Na dúvida', texto: 'compare preço, estoque e localização lado a lado.' },
  { momento: 'Precisa de ajuda', texto: 'chame um vendedor sem fila.' },
]

export function Inicio() {
  const navegar = useNavigate()
  const { lojaAtual, definirLojaAtual } = useLojaAtual()
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
    <div className="space-y-14 md:space-y-20">
      <section>
        {/* Hero: bloco cinza com o título à esquerda e a jornada num painel verde à direita */}
        <div className="grid overflow-hidden rounded-m bg-surface-2 md:grid-cols-[1.4fr_1fr]">
          <div className="px-8 pt-10 pb-10 md:px-14 md:pt-16 md:pb-24">
            <h1 className="text-3xl leading-tight font-semibold text-ink md:text-4xl">
              O produto certo, na loja certa, sem dar voltas.
            </h1>
            <p className="mt-4 max-w-lg text-ink-2 md:text-lg">
              Veja qual loja LEROY MERLIN tem o que você precisa, compare as opções e chegue direto ao corredor.
            </p>
          </div>
          <ul className="space-y-4 bg-brand px-8 py-8 pb-20 text-ink md:px-10 md:py-16 md:pb-28">
            {jornada.map((passo) => (
              <li key={passo.momento} className="text-sm leading-snug md:text-base">
                <span className="font-semibold">{passo.momento}:</span> {passo.texto}
              </li>
            ))}
          </ul>
        </div>

        {/* Busca: cartão branco com filete verde-escuro, sobrepondo a base do hero */}
        <div className="relative z-10 mx-3 -mt-10 rounded-m border border-line border-t-4 border-t-accent bg-white p-4 md:mx-10 md:-mt-12 md:p-6">
          <FormularioBusca
            cidades={cidades}
            carregandoCidades={lojas.carregando}
            sugestoes={sugestoesBusca}
            aoBuscar={buscar}
          />
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <TituloSecao>Já está na loja?</TituloSecao>
            <p className="mt-2 max-w-xl text-sm text-ink-2">
              Escolha a unidade para buscar produtos, ver o caminho na planta e chamar um vendedor.
            </p>
          </div>
          <p className="text-xs text-ink-3">Na entrada da loja, o QR code abre o site já na unidade certa.</p>
        </div>
        <div className="mt-6">
          <SeletorLoja
            lojas={lojas.dados}
            carregando={lojas.carregando}
            erro={lojas.erro}
            recarregar={lojas.recarregar}
            lojaAtualId={lojaAtual?.id ?? null}
            aoEscolher={(loja) => {
              definirLojaAtual(loja)
              navegar(`/loja/${loja.id}`)
            }}
          />
        </div>
      </section>
    </div>
  )
}
