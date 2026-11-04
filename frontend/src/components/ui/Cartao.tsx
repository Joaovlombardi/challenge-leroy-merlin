import type { HTMLAttributes } from 'react'

interface CartaoProps extends HTMLAttributes<HTMLDivElement> {
  destacado?: boolean
}

/** Superfície branca com borda. Sem sombra: a hierarquia vem do espaço e da tipografia. */
export function Cartao({ destacado = false, className = '', ...props }: CartaoProps) {
  return (
    <div
      className={`rounded-m border bg-white ${destacado ? 'border-accent' : 'border-line'} ${className}`}
      {...props}
    />
  )
}
