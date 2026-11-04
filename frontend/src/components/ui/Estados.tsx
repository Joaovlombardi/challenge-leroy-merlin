import type { ReactNode } from 'react'
import { Botao } from './Botao'
import { Icone, type NomeIcone } from './Icone'

/** Bloco cinza pulsante usado enquanto os dados carregam. */
export function Esqueleto({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-s bg-surface-2 ${className}`} />
}

/** Cartão inteiro em esqueleto, para listas. */
export function CartaoEsqueleto() {
  return (
    <div className="rounded-m border border-line bg-white p-5 shadow-card">
      <Esqueleto className="h-5 w-2/5" />
      <Esqueleto className="mt-2 h-4 w-1/3" />
      <Esqueleto className="mt-5 h-4 w-3/4" />
      <Esqueleto className="mt-2 h-4 w-1/2" />
      <div className="mt-5 flex gap-2">
        <Esqueleto className="h-11 w-32" />
        <Esqueleto className="h-11 w-32" />
      </div>
    </div>
  )
}

interface EstadoVazioProps {
  icone?: NomeIcone
  titulo: string
  descricao?: string
  children?: ReactNode
}

/** Mensagem centralizada para listas vazias e páginas sem resultado. */
export function EstadoVazio({ icone = 'busca', titulo, descricao, children }: EstadoVazioProps) {
  return (
    <div className="rounded-m border border-dashed border-line bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-bg text-accent">
        <Icone nome={icone} tamanho={26} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{titulo}</h3>
      {descricao && <p className="mx-auto mt-1 max-w-md text-sm text-ink-3">{descricao}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}

interface AlertaErroProps {
  mensagem: string
  aoTentarDeNovo?: () => void
}

/** Aviso de erro com botão de tentar de novo (cores de status "error" do guia). */
export function AlertaErro({ mensagem, aoTentarDeNovo }: AlertaErroProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-m border border-error-border bg-error-bg p-4 text-error sm:flex-row sm:items-center"
    >
      <Icone nome="alerta" className="text-error" />
      <p className="flex-1 text-sm font-medium">{mensagem}</p>
      {aoTentarDeNovo && (
        <Botao variante="secundario" tamanho="sm" onClick={aoTentarDeNovo}>
          <Icone nome="recarregar" tamanho={16} />
          Tentar de novo
        </Botao>
      )}
    </div>
  )
}
