import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogo } from '@/services/catalogo'
import { sugestoesBusca } from '@/mocks/dados'
import { useCarregar } from '@/hooks/useCarregar'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { BotaoLink } from '@/components/ui'
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
      <section className="pt-4 md:pt-10">
        <h1 className="max-w-2xl text-3xl leading-tight font-semibold text-ink md:text-4xl">
          O produto certo, na loja certa, sem dar voltas.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2 md:text-lg">
          Veja qual loja LEROY MERLIN tem o que você precisa, compare as opções e chegue direto ao corredor.
        </p>
        <div className="mt-8 rounded-m bg-surface-2 p-4 md:p-6">
          <FormularioBusca
            cidades={cidades}
            carregandoCidades={lojas.carregando}
            sugestoes={sugestoesBusca}
            aoBuscar={buscar}
          />
        </div>
      </section>

      <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-[1fr_1.6fr] md:gap-12">
        <div>
          <h2 className="text-xl font-semibold text-ink">Já está na loja?</h2>
          <p className="mt-2 text-sm text-ink-2">
            Escolha a unidade para buscar produtos, ver o caminho na planta e chamar um vendedor. Na entrada, o QR
            code abre o site já na sua loja.
          </p>
          {lojaAtual && (
            <div className="mt-5">
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

      <section className="border-t border-line pt-10">
        <h2 className="text-xl font-semibold text-ink">Como funciona</h2>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {passos.map((passo, indice) => (
            <li key={passo.titulo}>
              <span className="text-sm font-semibold text-accent">{indice + 1}</span>
              <h3 className="mt-1 font-semibold text-ink">{passo.titulo}</h3>
              <p className="mt-1 text-sm text-ink-2">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
