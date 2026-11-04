import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { sugestoesBusca } from '@/mocks/dados'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { TituloSecao } from '@/components/layout/Layout'
import { FormularioBusca } from '@/components/catalogo/FormularioBusca'
import { SeletorLoja } from '@/components/catalogo/SeletorLoja'

const passos = [
  { titulo: 'Busque de casa', texto: 'Informe a cidade e o produto. Mostramos as lojas que têm em estoque e o menor preço.' },
  { titulo: 'Compare', texto: 'Veja preço, disponibilidade e localização das opções lado a lado.' },
  { titulo: 'Vá direto à prateleira', texto: 'Na loja, o site mostra corredor e seção. Se precisar, chame um vendedor sem fila.' },
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
    <div className="space-y-20 md:space-y-28">
      <section>
        {/* Hero: bloco cinza, muito respiro, um único detalhe verde no ponto final */}
        <div className="rounded-m bg-surface-2 px-8 pt-16 pb-28 md:px-16 md:pt-24 md:pb-36">
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-ink md:text-5xl">
            O produto certo, na loja certa, sem dar voltas<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            Veja qual loja LEROY MERLIN tem o que você precisa, compare as opções e chegue direto ao corredor.
          </p>
        </div>

        {/* Busca: cartão branco com filete verde, sobrepondo a base do hero */}
        <div className="relative z-10 mx-4 -mt-14 rounded-m border border-line border-t-4 border-t-brand bg-white p-5 md:mx-12 md:-mt-16 md:p-8">
          <FormularioBusca
            cidades={cidades}
            carregandoCidades={lojas.carregando}
            sugestoes={sugestoesBusca}
            aoBuscar={buscar}
          />
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <TituloSecao>Já está na loja?</TituloSecao>
            <p className="mt-3 max-w-xl text-ink-2">
              Escolha a unidade para buscar produtos, ver o caminho na planta e chamar um vendedor.
            </p>
          </div>
          <p className="text-sm text-ink-3">Na entrada da loja, o QR code abre o site já na unidade certa.</p>
        </div>
        <div className="mt-10">
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

      <section>
        <TituloSecao>Como funciona</TituloSecao>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          {passos.map((passo, indice) => (
            <li key={passo.titulo} className="flex gap-5 md:block">
              <span className="text-5xl leading-none font-semibold text-brand">{indice + 1}</span>
              <div className="md:mt-5">
                <h3 className="text-lg font-semibold text-ink">{passo.titulo}</h3>
                <p className="mt-2 text-ink-2">{passo.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
