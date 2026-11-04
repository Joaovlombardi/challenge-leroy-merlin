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
    'rounded-full px-3 py-2 text-sm font-semibold transition-colors ' +
    (isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-100')
  )
}

export function Cabecalho() {
  const { lojaAtual, sairDaLoja } = useLojaAtual()

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
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
        <div className="border-t border-brand-100 bg-brand-50">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-medium text-brand-800">
            <Icone nome="pin" tamanho={14} />
            <span>
              Você está na <strong>{lojaAtual.nome}</strong>
            </span>
            <Link to={`/loja/${lojaAtual.id}`} className="ml-auto underline underline-offset-2 hover:text-brand-900">
              Abrir loja
            </Link>
            <button
              type="button"
              onClick={sairDaLoja}
              className="rounded-full px-2 py-0.5 text-brand-700 hover:bg-brand-100"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
