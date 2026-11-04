import type { HTMLAttributes } from 'react'
import { Icone, type NomeIcone } from './Icone'

export type TomSelo = 'verde' | 'cinza' | 'laranja' | 'amarelo' | 'escuro'

const tons: Record<TomSelo, string> = {
  verde: 'bg-brand-100 text-brand-800',
  cinza: 'bg-ink-100 text-ink-700',
  laranja: 'bg-alert-50 text-alert-700',
  amarelo: 'bg-sun-50 text-sun-700',
  escuro: 'bg-ink-900 text-white',
}

interface SeloProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: TomSelo
  icone?: NomeIcone
}

/** Etiqueta pequena para status e destaques ("Mais barato", "Em estoque"). */
export function Selo({ tom = 'cinza', icone, className = '', children, ...props }: SeloProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tons[tom]} ${className}`}
      {...props}
    >
      {icone && <Icone nome={icone} tamanho={14} />}
      {children}
    </span>
  )
}

/** Selo de estoque com a cor certa para cada situação. */
export function SeloEstoque({ estoque }: { estoque: number }) {
  if (estoque <= 0) return <Selo tom="laranja">Sem estoque</Selo>
  if (estoque <= 3) return <Selo tom="amarelo">Últimas {estoque} unidades</Selo>
  return <Selo tom="verde">{estoque} em estoque</Selo>
}
