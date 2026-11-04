import type { HTMLAttributes } from 'react'
import { Icone, type NomeIcone } from './Icone'

/** Tons seguem as cores de status do guia: sucesso, info, aviso, erro, mais neutro e escuro. */
export type TomSelo = 'sucesso' | 'info' | 'aviso' | 'erro' | 'neutro' | 'escuro'

const tons: Record<TomSelo, string> = {
  sucesso: 'border-success-border bg-success-bg text-success',
  info: 'border-info-border bg-info-bg text-info',
  aviso: 'border-warning-border bg-warning-bg text-warning',
  erro: 'border-error-border bg-error-bg text-error',
  neutro: 'border-line bg-surface-2 text-ink-2',
  escuro: 'border-surface-inverse bg-surface-inverse text-white',
}

interface SeloProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: TomSelo
  icone?: NomeIcone
}

/** Etiqueta pequena para status e destaques ("Mais barato", "Em estoque"). */
export function Selo({ tom = 'neutro', icone, className = '', children, ...props }: SeloProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-s border px-2 py-0.5 text-xs font-semibold ${tons[tom]} ${className}`}
      {...props}
    >
      {icone && <Icone nome={icone} tamanho={14} />}
      {children}
    </span>
  )
}

/** Selo de estoque com a cor certa para cada situação. */
export function SeloEstoque({ estoque }: { estoque: number }) {
  if (estoque <= 0) return <Selo tom="erro">Sem estoque</Selo>
  if (estoque <= 3) return <Selo tom="aviso">Últimas {estoque} unidades</Selo>
  return <Selo tom="sucesso">{estoque} em estoque</Selo>
}
