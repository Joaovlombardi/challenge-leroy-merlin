interface LogotipoProps {
  className?: string
}

/**
 * Logo oficial LEROY MERLIN (arquivo em public/, nunca redesenhado) seguido
 * do nome do produto. O logo é propriedade da Leroy Merlin.
 */
export function Logotipo({ className = '' }: LogotipoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img src="/logo-leroy-merlin.png" alt="LEROY MERLIN" width={60} height={36} className="h-9 w-auto" />
      <span aria-hidden="true" className="h-6 w-px bg-line" />
      <span className="text-lg font-semibold tracking-tight text-ink">Guia</span>
    </span>
  )
}
