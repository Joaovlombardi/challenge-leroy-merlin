import { Link, NavLink } from 'react-router-dom'
import { useLojaAtual } from '@/contexts/LojaAtualContext'
import { Icone } from '@/components/ui'
import { Logotipo } from './Logotipo'

const itens = [
  { para: '/', texto: 'Início', fim: true },
  { para: '/lojas', texto: 'Buscar loja', fim: false },
  { para: '/vendedor', texto: 'Vendedor', fim: false },
]

function classeItem({ isActive }: { isActive: boolean }): string {
  return (
    'border-b-2 py-5 text-sm font-semibold transition-colors ' +
    (isActive ? 'border-accent text-ink' : 'border-transparent text-ink-2 hover:text-ink')
  )
}

export function Cabecalho() {
  const { lojaAtual, sairDaLoja } = useLojaAtual()

  return (
    <header className="bg-white">
      <div aria-hidden="true" className="h-1 bg-brand" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 border-b border-line px-4">
        <Link to="/" aria-label="Leroy Guia, página inicial" className="py-3">
          <Logotipo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-5">
          {itens.map((item) => (
            <NavLink key={item.para} to={item.para} end={item.fim} className={classeItem}>
              {item.texto}
            </NavLink>
          ))}
        </nav>
      </div>

      {lojaAtual && (
        <div className="border-b border-success-border bg-success-bg">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm text-ink-2">
            <Icone nome="pin" tamanho={16} className="text-accent" />
            <span>
              Você está na <strong className="font-semibold text-ink">{lojaAtual.nome}</strong>
            </span>
            <Link to={`/loja/${lojaAtual.id}`} className="ml-auto font-semibold text-accent hover:underline">
              Abrir loja
            </Link>
            <button type="button" onClick={sairDaLoja} className="text-ink-3 hover:text-ink hover:underline">
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
