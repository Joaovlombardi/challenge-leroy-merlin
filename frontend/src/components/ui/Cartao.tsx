import type { HTMLAttributes } from 'react'

interface CartaoProps extends HTMLAttributes<HTMLDivElement> {
  destacado?: boolean
}

/** Superfície branca com borda. O destaque é um filete verde no topo. */
export function Cartao({ destacado = false, className = '', ...props }: CartaoProps) {
  return (
    <div
      className={`rounded-m border border-line bg-white ${destacado ? 'border-t-4 border-t-brand' : ''} ${className}`}
      {...props}
    />
  )
}
