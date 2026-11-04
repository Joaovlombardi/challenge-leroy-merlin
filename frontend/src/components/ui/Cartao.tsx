import type { HTMLAttributes } from 'react'

interface CartaoProps extends HTMLAttributes<HTMLDivElement> {
  destacado?: boolean
}

/** Superfície branca com borda suave e sombra leve. */
export function Cartao({ destacado = false, className = '', ...props }: CartaoProps) {
  return (
    <div
      className={
        `rounded-m border bg-white shadow-card ${destacado ? 'border-accent-border ring-2 ring-accent' : 'border-line'} ` +
        className
      }
      {...props}
    />
  )
}
