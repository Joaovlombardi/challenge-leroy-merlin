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
    'rounded-s px-3 py-2 text-sm font-semibold transition-colors ' +
    (isActive ? 'bg-accent-bg text-accent' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')
  )
}

export function Cabecalho() {
  const { lojaAtual, sairDaLoja } = useLojaAtual()

  return (
    <header className="sticky top-0 z-20 bg-white shadow-card">
      <div aria-hidden="true" className="h-1 bg-brand" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" aria-label="Leroy Guia, página inicial">
          <Logotipo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          {itens.map((item) => (
            <NavLink key={item.para} to={item.para} end={item.fim} className={classeItem}>
              {item.texto}
            </NavLink>
          ))}
        </nav>
      </div>

      {lojaAtual && (
        <div className="border-t border-success-border bg-success-bg">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-medium text-success">
            <Icone nome="pin" tamanho={14} />
            <span>
              Você está na <strong>{lojaAtual.nome}</strong>
            </span>
            <Link to={`/loja/${lojaAtual.id}`} className="ml-auto underline underline-offset-2 hover:text-accent-hover">
              Abrir loja
            </Link>
            <button type="button" onClick={sairDaLoja} className="rounded-s px-2 py-0.5 text-accent hover:bg-white">
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
