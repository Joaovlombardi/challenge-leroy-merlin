interface LogotipoProps {
  /** Versão clara para fundos verdes. */
  claro?: boolean
  className?: string
}

/** Marca do Leroy Guia: pino de localização sobre o verde da Leroy Merlin. */
export function Logotipo({ claro = false, className = '' }: LogotipoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" width={32} height={32} aria-hidden="true" className="shrink-0">
        <rect width="64" height="64" rx="14" fill={claro ? '#ffffff' : '#78be20'} />
        <path
          d="M32 50c0 0 14-12.6 14-24a14 14 0 1 0-28 0c0 11.4 14 24 14 24z"
          fill={claro ? '#78be20' : '#ffffff'}
        />
        <circle cx="32" cy="26" r="6" fill={claro ? '#ffffff' : '#78be20'} />
      </svg>
      <span className={`text-lg font-extrabold tracking-tight ${claro ? 'text-white' : 'text-ink-900'}`}>
        Leroy <span className={claro ? 'text-brand-200' : 'text-brand-600'}>Guia</span>
      </span>
    </span>
  )
}
