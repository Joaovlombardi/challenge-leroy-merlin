import type { HTMLAttributes } from 'react'

interface CartaoProps extends HTMLAttributes<HTMLDivElement> {
  destacado?: boolean
}

/** Superfície branca com borda suave e sombra leve. */
export function Cartao({ destacado = false, className = '', ...props }: CartaoProps) {
  return (
    <div
      className={
        `rounded-card border bg-white shadow-card ${destacado ? 'border-brand-400 ring-4 ring-brand-100' : 'border-ink-100'} ` +
        className
      }
      {...props}
    />
  )
}
