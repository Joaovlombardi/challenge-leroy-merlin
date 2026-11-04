import type { SVGProps } from 'react'

const caminhos = {
  busca: 'M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  pin: 'M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  casa: 'M3 11l9-8 9 8M5 10v10h14V10',
  loja: 'M3 9l1.5-5h15L21 9M3 9h18M4 9v11h16V9M9 20v-6h6v6',
  comparar: 'M4 4h6v16H4zM14 9h6v11h-6z',
  ajuda: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  seta: 'M5 12h14M12 5l7 7-7 7',
  voltar: 'M19 12H5M12 19l-7-7 7-7',
  check: 'M20 6L9 17l-5-5',
  fechar: 'M18 6L6 18M6 6l12 12',
  rota: 'M5 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 16c7 0 4-8 11-8',
  qr: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 21h1M21 14h-1',
  filtro: 'M3 5h18M6 12h12M10 19h4',
  etiqueta: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
  caixa: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  alerta: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  recarregar: 'M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6',
  obra: 'M4 21h16M6 21V11a6 6 0 0 1 12 0v10M9 21v-4h6v4M12 3v2',
} as const

export type NomeIcone = keyof typeof caminhos

interface IconeProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  nome: NomeIcone
  tamanho?: number
}

/** Ícones de linha, 24x24, desenhados com traço na cor do texto. */
export function Icone({ nome, tamanho = 20, className = '', ...props }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d={caminhos[nome]} />
    </svg>
  )
}

/** Estrela preenchida para avaliações. */
export function Estrela({ cheia, className = '' }: { cheia: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      aria-hidden="true"
      className={`shrink-0 ${cheia ? 'text-accent' : 'text-line'} ${className}`}
      fill="currentColor"
    >
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  )
}
