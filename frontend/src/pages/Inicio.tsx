import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { sugestoesBusca } from '@/mocks/dados'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { BotaoLink } from '@/components/ui'
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
    <div className="space-y-14 md:space-y-20">
      <section>
        {/* Hero: bloco no verde da marca, texto preto como no logo */}
        <div className="rounded-m bg-brand">
          <div className="max-w-2xl px-8 pt-10 pb-20 md:px-14 md:pt-16 md:pb-24">
            <h1 className="text-3xl leading-tight font-semibold text-ink md:text-4xl">
              O produto certo, na loja certa, sem dar voltas.
            </h1>
            <p className="mt-4 text-ink md:text-lg">
              Veja qual loja LEROY MERLIN tem o que você precisa, compare as opções e chegue direto ao corredor.
            </p>
          </div>
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

      <section className="grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-12">
        {/* A coluna de texto acompanha a rolagem até o fim da lista de lojas */}
        <div className="md:sticky md:top-8 md:self-start">
          <TituloSecao>Já está na loja?</TituloSecao>
          <p className="mt-3 text-sm text-ink-2">
            Escolha a unidade para buscar produtos, ver o caminho na planta e chamar um vendedor. Na entrada, o QR
            code abre o site já na sua loja.
          </p>
          {lojaAtual && (
            <div className="mt-5 border-l-4 border-brand pl-4">
              <p className="text-sm text-ink-2">
                Você está na <strong className="font-semibold text-ink">{lojaAtual.nome}</strong>.
              </p>
              <BotaoLink to={`/loja/${lojaAtual.id}`} tamanho="sm" className="mt-2">
                Continuar nesta loja
              </BotaoLink>
            </div>
          )}
        </div>
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
      </section>

      <section>
        <TituloSecao>Como funciona</TituloSecao>
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {passos.map((passo, indice) => (
            <li key={passo.titulo} className="flex gap-4 md:block">
              <span className="text-4xl leading-none font-semibold text-brand md:text-5xl">{indice + 1}</span>
              <div className="md:mt-4">
                <h3 className="font-semibold text-ink">{passo.titulo}</h3>
                <p className="mt-1 text-sm text-ink-2">{passo.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
