import { useEffect, useState, type FormEvent } from 'react'
import { Botao, Campo, Seletor } from '@/components/ui'

interface FormularioBuscaProps {
  cidades: string[]
  carregandoCidades?: boolean
  cidadeInicial?: string
  produtoInicial?: string
  /** Termos prontos para o cliente tocar e buscar na hora. */
  sugestoes?: string[]
  /** Campos um abaixo do outro e botão largo, para colunas estreitas. */
  empilhado?: boolean
  aoBuscar: (cidade: string, produto: string) => void
}

/** Formulário de busca: cidade + o que o cliente procura. */
export function FormularioBusca({
  cidades,
  carregandoCidades = false,
  cidadeInicial = '',
  produtoInicial = '',
  sugestoes = [],
  empilhado = false,
  aoBuscar,
}: FormularioBuscaProps) {
  const [cidade, setCidade] = useState(cidadeInicial)
  const [produto, setProduto] = useState(produtoInicial)

  useEffect(() => setCidade(cidadeInicial), [cidadeInicial])
  useEffect(() => setProduto(produtoInicial), [produtoInicial])

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    aoBuscar(cidade.trim(), produto.trim())
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <div className={`grid gap-3 ${empilhado ? '' : 'sm:grid-cols-[1fr_1.6fr_auto] sm:items-end'}`}>
        <Seletor
          rotulo="Cidade"
          value={cidade}
          onChange={(evento) => setCidade(evento.target.value)}
          disabled={carregandoCidades}
          textoVazio={carregandoCidades ? 'Carregando…' : 'Todas as cidades'}
          opcoes={cidades.map((nome) => ({ valor: nome, texto: nome }))}
        />
        <Campo
          rotulo="O que você procura?"
          icone="busca"
          type="search"
          placeholder="Ex.: tinta para parede, furadeira, torneira"
          value={produto}
          onChange={(evento) => setProduto(evento.target.value)}
          autoComplete="off"
        />
        <Botao type="submit" className={`h-12 px-6 ${empilhado ? 'mt-1 w-full' : ''}`}>
          Buscar lojas
        </Botao>
      </div>

      {sugestoes.length > 0 && (
        <p className="text-sm text-ink-3">
          Sugestões:{' '}
          {sugestoes.map((sugestao, indice) => (
            <span key={sugestao}>
              {indice > 0 && <span aria-hidden="true"> · </span>}
              <button
                type="button"
                onClick={() => {
                  setProduto(sugestao)
                  aoBuscar(cidade.trim(), sugestao)
                }}
                className="rounded-s text-accent underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {sugestao}
              </button>
            </span>
          ))}
        </p>
      )}
    </form>
  )
}
