import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { Icone, type NomeIcone } from './Icone'

const classesControle =
  'h-12 w-full rounded-m border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 ' +
  'transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-surface-2'

function Rotulo({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink-2">
      {children}
    </label>
  )
}

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
  icone?: NomeIcone
}

export function Campo({ rotulo, icone, id, className = '', ...props }: CampoProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado
  return (
    <div className={className}>
      <Rotulo htmlFor={idCampo}>{rotulo}</Rotulo>
      <div className="relative">
        {icone && (
          <Icone nome={icone} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
        )}
        <input id={idCampo} className={`${classesControle} ${icone ? 'pl-11' : ''}`} {...props} />
      </div>
    </div>
  )
}

interface OpcaoSeletor {
  valor: string
  texto: string
}

interface SeletorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string
  opcoes: OpcaoSeletor[]
  textoVazio?: string
  icone?: NomeIcone
}

export function Seletor({ rotulo, opcoes, textoVazio, icone, id, className = '', ...props }: SeletorProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado
  return (
    <div className={className}>
      <Rotulo htmlFor={idCampo}>{rotulo}</Rotulo>
      <div className="relative">
        {icone && (
          <Icone nome={icone} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
        )}
        <select id={idCampo} className={`${classesControle} appearance-none pr-10 ${icone ? 'pl-11' : ''}`} {...props}>
          {textoVazio !== undefined && <option value="">{textoVazio}</option>}
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.texto}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}
