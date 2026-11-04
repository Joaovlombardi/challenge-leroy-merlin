import { useEffect, useState, type FormEvent } from 'react'
import { Botao, Campo, Icone, Seletor } from '@/components/ui'

interface FormularioBuscaProps {
  cidades: string[]
  carregandoCidades?: boolean
  cidadeInicial?: string
  produtoInicial?: string
  /** Termos prontos para o cliente tocar e buscar na hora. */
  sugestoes?: string[]
  /** Versão menor, para o topo da página de resultados. */
  compacto?: boolean
  aoBuscar: (cidade: string, produto: string) => void
}

/** Formulário "Estou em casa": cidade + o que o cliente procura. */
export function FormularioBusca({
  cidades,
  carregandoCidades = false,
  cidadeInicial = '',
  produtoInicial = '',
  sugestoes = [],
  compacto = false,
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
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
        <Seletor
          rotulo="Cidade"
          icone="pin"
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
        <Botao type="submit" tamanho={compacto ? 'md' : 'lg'} className="h-12 sm:w-auto">
          <Icone nome="busca" tamanho={18} />
          Buscar lojas
        </Botao>
      </div>

      {sugestoes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-3">Sugestões:</span>
          {sugestoes.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => {
                setProduto(sugestao)
                aoBuscar(cidade.trim(), sugestao)
              }}
              className="rounded-s border border-line bg-white px-3 py-1 text-xs font-medium text-ink-2 transition-colors hover:border-accent-border hover:text-accent-hover"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
